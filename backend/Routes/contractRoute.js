const express = require('express');
const router = express.Router();
const { getAllContracts, getContractById, createContract, updateContract, deleteContract } = require('../controllers/contractController');

router.get('/getAll', getAllContracts);
router.get('/getById/:id', getContractById);
router.post('/create', createContract);
router.put('/update/:id', updateContract);
router.delete('/delete/:id', deleteContract);

module.exports = router;