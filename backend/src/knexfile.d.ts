declare module '../../knexfile' {
  const knexConfig: {
    development: {
      client: string;
      connection: {
        filename: string;
      };
      useNullAsDefault: boolean;
      migrations: {
        directory: string;
      };
      seeds: {
        directory: string;
      };
    };
    production: {
      client: string;
      connection: string | {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
      };
      pool?: {
        min: number;
        max: number;
      };
      migrations: {
        tableName: string;
        directory: string;
      };
      seeds: {
        directory: string;
      };
    };
  };
  export default knexConfig;
}
