import * as migration_20250302_200206 from './20250302_200206';
import * as migration_seed from './seed';

export const migrations = [
  {
    up: migration_20250302_200206.up,
    down: migration_20250302_200206.down,
    name: '20250302_200206',
  },
  {
    up: migration_seed.up,
    down: migration_seed.down,
    name: 'seed'
  },
];
