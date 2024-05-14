const cooldownMapping = {
  BT0_space_rare_small_0: 72,
  BT0_space_rare_medium_0: 66,
  BT0_space_rare_large_0: 60,
  BT0_space_epic_small_0: 66,
  BT0_space_epic_medium_0: 60,
  BT0_space_epic_large_0: 54,
  BT0_space_legendary_small_0: 60,
  BT0_space_legendary_medium_0: 54,
  BT0_space_legendary_large_0: 48,
  BT0_space_mythic_small_0: 54,
  BT0_space_mythic_medium_0: 48,
  BT0_space_mythic_large_0: 42,
  BT0_space_exalted_small_0: 48,
  BT0_space_exalted_medium_0: 42,
  BT0_space_exalted_large_0: 36,
}

const spaceTypes = Object.keys(cooldownMapping)

export { cooldownMapping, spaceTypes }
