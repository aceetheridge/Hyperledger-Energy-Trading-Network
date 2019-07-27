const CREATE_RESIDENT = "CreateResident";
const CREATE_TOKEN = "CreateToken";
const CREATE_ENERGY = "CreateEnergy";
const CREATE_CASH = "CreateCash";
const GET_RESIDENT = "RetrieveResident";
const GET_TOKEN = "RetrieveToken";
const GET_CASH = "RetrieveCash";
const GET_ENERGY = "RetrieveEnergy";
const GET_ALL_TRAN = "GetAllTran";
const TRADE = "EnergyTokenTransaction";
const TESTUSER = "admin";
module.exports = Object.freeze({
    createResident: CREATE_RESIDENT,
    createToken: CREATE_TOKEN,
    createEnergy: CREATE_ENERGY,
    createCash: CREATE_CASH,
    getResident: GET_RESIDENT,
    getToken: GET_TOKEN,
    getCash: GET_CASH,
    getEnergy: GET_ENERGY,
    getTransactions: GET_ALL_TRAN,
    trade: TRADE,
    USER: TESTUSER
});
