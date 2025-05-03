import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: false, // optional
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connected");

        await sequelize.sync(); // or `sync({ force: true })` to recreate
        console.log("All models synchronized");

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
};

export { sequelize };
export default connectDB;
