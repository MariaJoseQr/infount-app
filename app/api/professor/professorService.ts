import { ProfessorDAO } from "./professorDAO";

export class ProfessorService {

    static async getAllProfessors() {
        const professors = await ProfessorDAO.getAllProfessors();

        return professors;
    }
}