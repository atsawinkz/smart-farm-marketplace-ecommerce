const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Fetching Thai geography data...');
  try {
    const provRes = await fetch('https://raw.githubusercontent.com/thailand-geography-data/thailand-geography-json/main/src/provinces.json');
    const provinces = await provRes.json();

    const distRes = await fetch('https://raw.githubusercontent.com/thailand-geography-data/thailand-geography-json/main/src/districts.json');
    const districts = await distRes.json();

    const subRes = await fetch('https://raw.githubusercontent.com/thailand-geography-data/thailand-geography-json/main/src/subdistricts.json');
    const subdistricts = await subRes.json();

    console.log('Processing data...');
    // Create lookup maps
    const provinceMap = {};
    for (const p of provinces) {
      provinceMap[p.provinceCode] = p.provinceNameTh;
    }

    const districtMap = {};
    for (const d of districts) {
      districtMap[d.districtCode] = d.districtNameTh;
    }

    const result = {};

    for (const s of subdistricts) {
      const provinceName = provinceMap[s.provinceCode];
      if (!provinceName) continue;

      const districtName = districtMap[s.districtCode];
      if (!districtName) continue;

      const subdistrictName = s.subdistrictNameTh;
      const zipCode = String(s.postalCode || '');

      // Normalize district prefix in Thai:
      // For Bangkok, districts are called "เขต" (e.g. เขตพระนคร), subdistricts are "แขวง" (e.g. แขวงพระบรมมหาราชวัง)
      // For other provinces, districts are called "อำเภอ" (e.g. อำเภอเมืองขอนแก่น), subdistricts are "ตำบล"
      let formattedDistrict = districtName;
      if (provinceName === 'กรุงเทพมหานคร') {
        if (!formattedDistrict.startsWith('เขต')) {
          formattedDistrict = 'เขต' + formattedDistrict;
        }
      } else {
        if (!formattedDistrict.startsWith('อำเภอ')) {
          // If the district name already has "เมือง" but not "อำเภอเมือง"
          formattedDistrict = 'อำเภอ' + formattedDistrict;
        }
      }

      if (!result[provinceName]) {
        result[provinceName] = {};
      }
      if (!result[provinceName][formattedDistrict]) {
        result[provinceName][formattedDistrict] = {};
      }
      result[provinceName][formattedDistrict][subdistrictName] = zipCode;
    }

    const targetPath = path.join(__dirname, '../src/lib/thai-address.json');
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log('Successfully wrote parsed Thai location data to', targetPath);
  } catch (error) {
    console.error('Error fetching/processing address data:', error);
  }
}

main();
