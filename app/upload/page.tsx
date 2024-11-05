"use client";

import { convertExcelToJson } from '@/lib/utils';

import { ExcelData } from '@/types/ExcelData';

import { useState } from 'react';

const UploadPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<ExcelData[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const json = await convertExcelToJson(file);
        setJsonData(json);
        console.log(json);
      } catch (error) {
        console.error("Error al convertir el archivo: ", error);
      }
    }
  };

  return (
    <div className='text-black'>
      <h1>Ar-CHIVO: </h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      {
        jsonData && (
          <div>
            <h2>Datos JSON:</h2>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        )
      }
    </div>
  );
};

export default UploadPage;
