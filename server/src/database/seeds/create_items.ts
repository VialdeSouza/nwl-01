import Knex from "knex"

export async function seed(Knex: Knex){
await   Knex('items').insert([
        { title:'Lâmpadas', image:'lampadas.svg'},
        { title:'Pilhas e Baterias', image:'baterias.svg'},
        { title:'Papéis e Papelao', image:'papeis-papelao.svg'},
        { title:'Resíduos Eletrônicos', image:'eletronicos.svg'},
        { title:'Resíduos Orgânicos', image:'organicos.svg'},
        { title:'Óleo de cozinha', image:'oleo.svg'},

    ])
}