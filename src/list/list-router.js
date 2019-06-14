const logger = require('../logger');
const express = require('express');
const uuid = require('uuid/v4');
const { lists } = require('../store');

const listRouter = express.Router();
const bodyParser = express.json();

listRouter
  .route('/list')
  .get((req, res) => {
    res.json(lists);
  })
  .post(bodyParser, (req, res) => {
    const { header, cardIds = [] } = req.body;

    if (!header) {
      logger.error('No header provided');
      return res.status(400).send('invalid Data');
    }

    if (cardIds.length > 0) {
      let valid = true;
      cardIds.forEach(cid => {
        const card = card.find(c => c.id == cid);
        if (!card) {
          logger.error(`card with id ${id} not found`);
          valid = false;
        }
      });
      if (!valid) {
        return res.status(400).send('Invalid data');
      }
    }
    const id = uuid();
    const list = { header, cardIds, id };

    lists.push(list);
    logger.info(`List created with id ${id}`);
    res
      .status(201)
      .location(`http://localhost:8000/list/${id}`)
      .json({ id });
  });

listRouter
  .route('/list/:id')
  .get((req, res) => {
    const { id } = req.params;
    const list = lists.find(li => li.id == id);

    if (!list) {
      logger.error(`List with id ${id} not found`);
      return res.status(404).send('List not found');
    }
    res.send(list);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const index = lists.findIndex(l => l.id == id);

    if (index === -1) {
      logger.error('List not found');
      return res.status(400).send('Invalid Data');
    }
    lists.splice(index, 1);
    logger.info(`list removed with id ${id}`);
    res.status(204).end();
  });

module.exports = listRouter;
