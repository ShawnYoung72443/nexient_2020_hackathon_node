import { appConfig } from '../appConfig';
import { User } from '../models/userdocs.model';
const CosmosClient = require("@azure/cosmos").CosmosClient;

let _cosmos = null
const cosmos = () => _cosmos = _cosmos || new CosmosClient(appConfig.getCosmosConfig());

const create = (document: User, collection: string, databaseid: string) =>
  new Promise((rs, rj) => {
    cosmos().database(databaseid).container(collection).items
      .create(document)
      .then(resp => {
        rs(resp.resource);
      })
      .catch(err => {
        rj(err);
      })
  });

const erase = (id:number, collection:string , databaseid:string) =>
  new Promise((rs, rj) => {
    const pk = id;
    cosmos().database(databaseid).container(collection)
      .item(id, pk)
      .delete()
      .then(resp => {
        rs(resp.resource);
      })
      .catch(err => {
        rj(err);
      })
  });

const getById = (id:number, collection:string , databaseid:string) =>
  new Promise((rs, rj) => {
    const pk = id;
    cosmos().database(databaseid).container(collection)
      .item(id, pk)
      .read()
      .then(resp => {
        rs(resp.resource);
      })
      .catch(err => {
        rj(err);
      })
  });

const getByParameters = (email:string, password:string, collection, databaseid) =>
new Promise((rs, rj) => {
  const options = { partitionKey: email }
  cosmos().database(databaseid).container(collection).items
    .query(
      {
        query: `SELECT * FROM c f WHERE f.email = @email AND f.password = @password`,
        parameters: [
          {
            name: '@email',
            value: email
          },
          {
            name: '@password',
            value: password
          }
        ]
      },
      options
    )
    .fetchAll()
    .then(resp => {
      rs(resp.resources);
    })
    .catch(err => {
      rj(err);
    })
});

const replace = (id:number, document:User, collection:string , databaseid:string) =>
  new Promise((rs, rj) => {
    const pk = id;
    cosmos().database(databaseid).container(collection)
      .item(id)
      .replace(document)
      .then(resp => {
        rs(resp.resource);
      })
      .catch(err => {
        rj(err);
      })
  });

export {
  create,
  erase,
  getById,
  getByParameters,
  replace,
};


