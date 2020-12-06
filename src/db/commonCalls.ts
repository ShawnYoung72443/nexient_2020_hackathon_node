import { appConfig } from './appConfig';
import {
    create,
    erase,
    getById,
    getByParameters,
    replace,
} from './cosmos/cosmosConnect';
import { User } from './models/userdocs.model';

const { database, collection } = appConfig.getUsersDbConfig();

const createUser = (doc: User):Promise<any> => {
    return create(doc, collection, database);
}

const eraseUser = (id: string):Promise<any> => {
    return erase(id, collection, database);
}

const getUserData = (email: string, password: string):Promise<any> => {
    
    return getByParameters(email, password, collection, database);
}

const updateUser = (doc: User):Promise<any> => {
    return replace(doc.userId, doc, collection, database);
}

export {
    createUser,
    eraseUser,
    getUserData,
    updateUser
};
