import { importDirectory } from '@iconify/tools';
import { writeFileSync } from 'node:fs';

const iconSet = await importDirectory('src/assets/icons', {
  prefix: 'custom',
});

const json = iconSet.export();

writeFileSync(
  'src/custom-icons.json',
  JSON.stringify(json, null, 2)
);

console.log('Custom Iconify collection generated → src/custom-icons.json');
