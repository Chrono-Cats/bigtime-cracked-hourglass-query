import initCycleTLS from 'cycletls'
import dayjs from 'dayjs'
import Space from './classes/Space.js'
import {
  cooldownMapping,
  spaceTypes,
  httpRequestOptions,
} from './variables.js'
import Database from './classes/Database.js'
import ora from 'ora'
import chalk from 'chalk'

const cycleTLS = await initCycleTLS()
const db = new Database()

async function getRentedSpaces() {
  let currentPage = 1,
    totalPages = 1
  let spaces = []

  while (currentPage <= totalPages) {
    console.log(`Querying rent order page ${currentPage}`)
    const response = await cycleTLS.get(
      `https://api.openloot.com/v2/market/me/rental-orders?page=${currentPage}&pageSize=1000&renter=true&sort=name%3Aasc`,
      httpRequestOptions
    )
    if (response.body.items.length === 0) break
    totalPages = response.body.totalPages

    response.body.items.forEach((item) => {
      const dueDate = dayjs(item.finishAt)
      item.rental.content.forEach((content) => {
        if (spaceTypes.includes(content.metadata.archetypeId)) {
          let datum = {
            id: content.id,
            dueDate,
          }
          spaces.push(datum)
        }
      })
    })
    currentPage++
  }
  return spaces
}

async function getAllSpaces() {
  let currentPage = 1,
    totalPages = 1
  let spaces = []

  while (currentPage <= totalPages) {
    console.log(`Querying all spaces page ${currentPage}`)
    const response = await cycleTLS.get(
      `https://api.openloot.com/v2/market/items/in-game?page=${currentPage}&pageSize=1000&sort=name%3Aasc&gameId=56a149cf-f146-487a-8a1c-58dc9ff3a15c&nftTags=NFT.SPACE`,
      httpRequestOptions
    )

    if (response.body.items.length === 0) break

    totalPages = response.body.totalPages

    response.body.items.forEach((item) => {
      let space = new Space(
        item.id,
        item.issuedId,
        item.metadata.archetypeId,
        item.metadata.name
      )
      const lastIssueTime = item.extra.attributes.find(
        (attr) => attr.name === 'LastCrackedHourGlassDropTime'
      )
      space.lastIssueTime = dayjs(lastIssueTime.value)
      spaces.push(space)
    })

    currentPage++
  }

  return spaces
}

async function main() {
  let rentedSpaces, allSpaces
  try {
    const result = await Promise.allSettled([getRentedSpaces(), getAllSpaces()])
    rentedSpaces = result[0].value
    allSpaces = result[1].value
  } catch (err) {
    console.error(err)
  }
  console.log('Spaces fetched successfully.')

  const sortedSpaces = allSpaces.sort((a, b) =>
    a.nextIssueTime.isBefore(b.nextIssueTime) ? 1 : -1
  )

  sortedSpaces.forEach(async (space, index) => {
    const rentData = rentedSpaces.find((data) => data.id === space.id)
    space.dueDate = rentData?.dueDate ?? dayjs().add(1, 'year')

    let order = chalk.green(`#${sortedSpaces.length - index}`)
    if (!space.remainTime) {
      console.log(
        `${order}\t${space.issueId}\t${space.name}\t${chalk.green('已掉落')}`
      )
    } else {
      console.log(
        `${order}\t${
          space.isDueBeforeNextIssue()
            ? chalk.strikethrough.red(space.issueId)
            : space.issueId
        }\t${space.name}\t${space.nextIssueTime.format(
          'MM-DD HH:mm:ss'
        )}\t${chalk.red(space.remainTime)}`
      )
    }
  })

  let latestSpace = sortedSpaces[sortedSpaces.length - 1]

  let spinner = ora('雲端資料庫更新中...').start();
  try {
    await db.batchWrite(sortedSpaces)
    spinner.succeed('雲端資料庫更新完成.')
  } catch (err) {
    spinner.fail('雲端資料庫更新失敗!')
    // console.error(err)
  }

  console.log(
    `建立行事曆: https://calendar.google.com/calendar/render?action=TEMPLATE&text=收菜&details=id+${
      latestSpace.issueId
    },+${latestSpace.nextIssueTime.format(
      'MM-DD+HH:mm:ss'
    )}&dates=${latestSpace.nextIssueTime.format(
      'YYYYMMDDTHHmmss'
    )}&ctz=Asia/Taipei`
  )

  process.exit(0)
}

main()
