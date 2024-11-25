
// Helper para excluir campos
export const excludeFields = <T extends Record<string, unknown>>(obj: T, fields: string[]): T => {
    const newObj = { ...obj };
    fields.forEach(field => {
        delete newObj[field];
    });
    return newObj;
};

export const excludeNestedFields = <T extends Record<string, unknown>>(obj: T, fields: string[]): T => {
    const newObj = { ...obj };

    fields.forEach(field => {
        const fieldParts = field.split('.'); // Dividimos la cadena en partes por el punto
        let tempObj: Record<string, unknown> = newObj;

        for (let i = 0; i < fieldParts.length - 1; i++) {
            // Si el objeto anidado no existe, salimos
            if (!(fieldParts[i] in tempObj)) {
                return;
            }
            tempObj = tempObj[fieldParts[i]] as Record<string, unknown>;
        }

        // Eliminamos la última propiedad especificada en la ruta
        delete tempObj[fieldParts[fieldParts.length - 1]];
    });

    return newObj;
};



/* Aplicacion:
const thesisDTO = thesisWithAllData.map((thesis) => 
    excludeFields(thesis, ['resolutionCode', 'secondStudentName'])
);
return thesisDTO;
*/