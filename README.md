# Next Level Week 01 <h5>por Rocketseat</h5>

#### Ecoleta.

## Sobre o projeto
<p>Esse projeto foi construído durante o Next Level Week 1. A semana é um curso elaborado pela RocketSeat, na qual semana desenvolvemos um backend express, uma aplicação web com ReactJS e uma app mobile com React Native. 
 Meus maiores aprendizados dessa semana foram: </p> 

- [TypeScript](https://www.typescriptlang.org/)
- [Validação de dados com Celebrate](https://www.npmjs.com/package/celebrate)
- [Upload de arquivos com Multer.js](https://www.npmjs.com/package/multer)
- [Seeds e Migrations Knex.js](http://knexjs.org/)
- [React-native-maps](https://www.npmjs.com/package/react-native-maps)
- [React-leaflet para renderização de mapa](https://react-leaflet.js.org/)
- Consumir APIs externas
- Boas práticas de programação =)


## Mobile
![untitled (1)](https://user-images.githubusercontent.com/38055818/84096511-21962080-a9d0-11ea-99ca-b34501ca4386.png)

#### Usando React-native-maps
```sh
import MapView, { Marker } from 'react-native-maps' 


 <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && ( ## validação de loading da posição inicial
            <MapView style={styles.map} ## Renderização do mapa
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.020,
                longitudeDelta: 0.020,
              }}>
              {points.map(point => (
                ## Criação dos pontos de marcação no mapa
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  coordinate={{ 
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => {HandleNavigateToDetail(point.id)}}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                    <Text style={styles.mapMarkerTitle}> {point.name} </Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
```

## Web com ReactJs


### Usando React-leaflet para renderização de mapa




## Backend Express.js
### Validação de dados com celebrate e Uploads de arquivos

```sh

  ## Routes.ts
  import {celebrate, Joi} from 'celebrate';
  ## Upload de arquivo e a validação dos campos são feitos na rota da api
  routes.post(
    '/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),

        })
    }),
    pointsControllers.create
    );
```


```sh

  ## Server.ts
  import path from 'path';
  import {errors} from 'celebrate';
  
  app.use('/uploads', express.static(path.resolve(__dirname,'..', 'uploads'))) //Path dos arquivos salvos.
  app.use(errors()); ##Usado para reportar erros de validação

```

```sh

  ## Multer.ts
  ## Configuração do Multer.js para upload de arquivo
  import multer from 'multer';
  import path from 'path';
  import crypto from 'crypto';
  
  export default{
      storage: multer.diskStorage({
          destination: path.resolve(__dirname,'..','..', 'uploads'), ##Diretório onde o arquivo será salvo.
          filename(request, file, callback){ ##renomeação do arquivo
              const hash = crypto.randomBytes(6).toString('hex'); 
              const fileName = `${hash}-${file.originalname}`;
              callback(null, fileName);
          },
      })
  }
```

## Seeds e Migrations com Knex.js

```sh
  ## Migrations com relacionamento
  import Knex from 'knex';
  
  ## Script de criação
  export async function up(knex: Knex) {
      return knex.schema.createTable('point_items', table => {
          table.increments('id').primary(); ## Autoincremento do campo
          table.integer('point_id')
              .notNullable()
              .references('id') ## Realacionamento com a tabela Points
              .inTable('points');
          table.integer('item_id')
          .notNullable()
          .references('id')  ## Realacionamento com a tabela Items
          .inTable('items');

      })
  };

 ## Script de drop
  export async function down(knex: Knex) {
      return knex.schema.dropTable('point_items');
  };
```
```sh
 ## Seeds de inserção na tabela items
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
```
