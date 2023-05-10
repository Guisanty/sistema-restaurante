import { Request, Response } from "express";
import { Folha } from "../models/folha.model";

let folhas : Folha[] = [];

export class FolhaController{
    cadastrar(request : Request, response : Response) : Response {

        let folha : Folha = new Folha();
        folha.cpf = request.body.cpf;
        folha.mes = request.body.mes;
        folha.ano = request.body.ano;
        folha.nome = request.body.nome;
        folha.horas = request.body.horas;
        folha.valor = request.body.valor;
        
        for(let folhaCadastrado of folhas){
            if(folhaCadastrado.cpf == folha.cpf && folhaCadastrado.ano == folha.ano && folhaCadastrado.mes == folha.mes){
               return response.status(404).json({message : "Folha já cadastrada"})
            } 
        }
        folhas.push(folha);
        return response.status(201).json({message : "Folha Cadastrada", dados : folha});
        }
    

    listar(request : Request, response : Response) : Response {
        return response.status(201).json({message : "Segue a listagem de folhas cadastradas", dados : folhas});

    }

    buscar(request : Request, response : Response) : Response {
            const { cpf, mes, ano } = request.params;

            for(let folhaCadastrado of folhas){
                if(folhaCadastrado.cpf == cpf && folhaCadastrado.mes == mes && folhaCadastrado.ano == ano){

                    let bruto : number;
                    let irrf : number;
                    let inss : number;
                    let fgts : number;
                    let liquido : number;

                    bruto = folhaCadastrado.horas*folhaCadastrado.valor;
//IMPOSTO DE RENDA
                    if (bruto<1908.98) {
                        irrf = 0;
                    } else {
                        if(bruto <= 2826.65) {
                            irrf = (bruto * 0.075) - 142.80
                        } else {
                            if(bruto <= 3751.05) {
                                irrf = (bruto * 0.15) - 354.80
                            } else {
                                if(bruto <= 4664.68) {
                                    irrf = (bruto * 0.225) - 636.13
                                } else {
                                    irrf = (bruto * 0.275) - 869.36
                                }
                            }
                        }
                    }
//INSS
                if(bruto<1693.72){
                    inss = bruto * 0.8
                } else {
                    if (bruto<=2822.90) {
                        inss = bruto * 0.9
                    } else {
                        if (bruto<=5645.80) {
                            inss = bruto * 0.11
                        } else {
                            inss = 621.03
                        }
                    }
                }
//FGTS
                fgts = bruto * 0.08;

//Salário Líquido
                liquido = bruto - irrf - inss;


                    return response.status(201).json(
                        {
                        nome : folhaCadastrado.nome,
                        cpf : folhaCadastrado.cpf,
                        horas : folhaCadastrado.horas,
                        valor : folhaCadastrado.valor,
                        mes : folhaCadastrado.mes,
                        ano : folhaCadastrado.ano,
                        bruto : bruto,
                        irrf : irrf,
                        inss : inss,
                        fgts : fgts,
                        liquido : liquido
                        
                    });
                }
            }
            return response.status(404).json({message : "Nenhuma folha foi encontrada!"});
    }
}
