import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import { ROOT_PATH } from './path';

import unzip from 'unzipper';
import luxon from 'luxon';
import download from 'download';
import glob from 'glob';

/**
 * description: create url for download data
 */


const createUrl = (isUpto: boolean, date: ReturnType<typeof getTodayDayMonthYear>) => {
  const [year, month, day] = date;
  const yearToDay = `${year}${month}${day}`;
  const dayToYear = `${day}${month}${year}`;
  const uptoParam = isUpto ? 'Upto' : '';
  return `https://cafef1.mediacdn.vn/data/ami_data/${yearToDay}/CafeF.SolieuGD.${uptoParam}${dayToYear}.zip`;
};

/**
 * description: get today's date
 */
const getTodayDayMonthYear = () => {
  const dur = luxon.DateTime.now()
    .plus({ days: -1 })
    .setZone('Asia/Ho_Chi_Minh');

  const year = dur.year;
  const month = dur.month >= 10 ? dur.month : `0${dur.month}`;
  const day = dur.day >= 10 ? dur.day : `0${dur.day}`;
  return [year, month, day] as const
}

/**
 * description: delay function
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * description: rename files
 */
const reNameFiles = (folder: string) => {
  const markets = ['HNX', 'HSX', 'UPCOM'] as const
  const filesPath: { [key in typeof markets[number]]: string } = { HNX: '', HSX: '', UPCOM: '' };
  glob(`${folder}/*.csv`, (error, files) => {
    files.forEach((file) => {
      markets.forEach(market => {
        if (file.includes(`CafeF.${market}`)) {
          const newPath = path.join(folder, `${market}.csv`)
          fs.rename(file, newPath, () => {
            filesPath[market] = newPath
          });
        }
      })
    }
    );
  });
  return filesPath
};

const deleteAllFilesInFolder = (folder: string) => {
  fsExtra.emptyDirSync(folder);
}

const downloadDataFromCafeF = async (url: string, downloadFolder: string) => {
  const downloadFileName = 'data.zip';
  const filePath = path.join(downloadFolder, downloadFileName);
  try {
    fs.writeFileSync(
      filePath,
      await download(url),
    );

    fs.createReadStream(filePath).pipe(
      unzip.Extract({ path: downloadFolder }),
    );

    await delay(2000);
    const filesPath = reNameFiles(downloadFolder);
    return filesPath;
  } catch (error) {
    return null
  }
};

const downloadStockData = async (isUpto: boolean, selectDate?: ReturnType<typeof getTodayDayMonthYear>) => {
  const date = selectDate || getTodayDayMonthYear();
  const url = createUrl(isUpto, date);
  const downloadFolder = path.join(ROOT_PATH, 'data');

  deleteAllFilesInFolder(downloadFolder);
  return await downloadDataFromCafeF(url, downloadFolder);
};

export default downloadStockData;