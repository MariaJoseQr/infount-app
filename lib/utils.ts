import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ExcelData } from "@/types/ExcelData";

export const convertExcelToJson = (file: File): Promise<ExcelData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const target = e.target;
      if (target && target.result) {
        const data = new Uint8Array(target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Asumiendo que quieres leer la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: ExcelData[] = XLSX.utils.sheet_to_json<ExcelData>(worksheet);

        resolve(json);
      } else {
        reject(new Error('Error al leer el archivo.'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

export const validateRegister = (register: ExcelData) => {

  if (register.tipo === "ACTA DE SUSTENTACIÓN DEL TRABAJO DE TESIS") {
    if (register.asesor !== undefined || register.asesor !== "-") {
      return {
        isValid: false,
        message: "El campo 'Asesor' debe estar vacío o contener un '-' cuando el tipo es 'ACTA DE SUSTENTACIÓN DEL TRABAJO DE TESIS'"
      }
    }
  }

  if (register.tipo === "PROYECTO DEL TRABAJO DE GRADUACIÓN" || register.tipo === "TRABAJO DE GRADUACIÓN") {
    if (register.fechaActa !== undefined || register.fechaActa !== "-") {
      return {
        isValid: false,
        message: "El campo 'Fecha de Acta de Sustentación' debe estar vacío o contener un '-' cuando el tipo es 'PROYECTO DEL TRABAJO DE GRADUACIÓN' o 'TRABAJO DE GRADUACIÓN'"
      }
    }
  }

  if (register.tipo === "TRABAJO DE GRADUACIÓN") {
    if (
      (register.presidente !== undefined || register.presidente !== "-") ||
      (register.secretario !== undefined || register.secretario !== "-") ||
      (register.vocal !== undefined || register.vocal !== "-")
    ) {
      return {
        isValid: false,
        message: "El campo 'Presiende, Secretario y vocal' debe estar vacío o contener un '-' cuando el tipo es 'TRABAJO DE GRADUACIÓN'"
      }
    }
  }

  return {
    isValid: true,
    message: "Validación Exitosa"
  }
}

export const validateRegisterArray = (registers: ExcelData[]) => {
  for (const register of registers) {
    const validationResult = validateRegister(register);
    if (!validationResult.isValid) {
      return {
        isValid: false,
        message: validationResult.message,
      };
    }
  }

  return {
    isValid: true,
    message: "Todas las validaciones han sido sexitosas",
  };
}


export const validateOneThesis = (registers: unknown) => {
  console.log("Thesis a validar: ", registers)

  //Titulo mayus, codigo no se repite, segundo alumno opcional, fecha y profesores obligatoria segun tipo, no puede repetirse profesor en misma tesis

  /*
  for (const register of registers) {
    const validationResult = validateRegister(register);
    if (!validationResult.isValid) {
      return {
        isValid: false,
        message: validationResult.message,
      };
    }
  }
*/
  return {
    isValid: true,
    message: "Todas las validaciones han sido sexitosas",
  };
}