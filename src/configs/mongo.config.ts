import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

const getMongoString = async (
    configService: ConfigService,
): Promise<string> => {
    const username = await configService.get('MONGO_NAME');
    const password = await configService.get('MONGO_PASSWORD');
    const host = await configService.get('MONGO_HOST');
    const port = await configService.get('MONGO_PORT');
    const DB_name = await configService.get('MONGO_AUTH_DB');

    return `mongodb://${username}:${password}@${host}:${port}/${DB_name}`;
};

export const getMongoConfig = async (
    configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => ({
    uri: await getMongoString(configService),
});
