import EventEmitter from 'events';
import http from 'http';

import { get } from 'lodash';

/**
 * CS:GO Game State Integration event emitter that fires custom events based on received payloads. Payloads may be authenticated if so configured
 */
class CsgoEventEmitter extends EventEmitter {
  /**
   * @constructor
   * @param {object} options
   * @param {string} options.host - [OPTIONAL] GSI event recipient server's host
   * @param {number} options.port - [OPTIONAL] GSI event recipient server's port
   * @param {string} options.authToken - [OPTIONAL] Auth token (if using any)
   * @param {boolean} options.serverless - [OPTIONAL] True if emitter is to be initialised without server
   */
  constructor(options) {
    super();

    this.options = options;

    if (!this.options.serverless) {
      this.createServer();
    }
  }

  /**
   * Starts listening to incoming GSI payloads
   */
  createServer() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });

      let eventInfo = '';

      req.on('data', data => {
        console.log('data received');

        try {
          eventInfo += this.processPayload(JSON.parse(data.toString()));
        } catch (e) { }
      });

      req.on('end', () => {
        console.log('event stream ended');

        if (eventInfo !== '') {
          console.log(eventInfo);
        }

        res.end('');
      });
    });

    server.listen(this.options.port, this.options.host);
  }

  /**
   * Processes payloads to parse game events
   *
   * @param {object} data - Payload as JSON object
   * @fires CsgoEventEmitter#data
   */
  processPayload(data) {
    // Ignore unauthenticated payloads
    if (!this.isAuthentic(data)) {
      return;
    }

    /**
     * Raw data event of CS:GO GSI. Listen to this if you wish to implement additional parsing of your own.
     *
     * @event CsgoEventEmitter#data
     * @type {object}
     * @property {object} raw - Raw data from GSI
     */
    this.emit('data', { raw: data });

    this.detectRoundEnd(data);
    this.detectMapEnd(data);
    this.detectBombExplosion(data);
    this.detectBombDefuse(data);
  }

  /**
   * Ensures that the data coming in is from an authentic source. Consider data always authentic if there is no auth token set
   *
   * @param {object} data - Payload as JSON object
   * @return {boolean}
   * @private
   */
  isAuthentic(data) {
    return this.options.authToken ? (get(data, 'auth.token') === this.options.authToken) : true;
  }

  /**
   * Parses round endings from payloads
   *
   * @param {object} data - Payload as JSON object
   * @fires CsgoEventEmitter#roundEnd
   */
  detectRoundEnd(data) {
    if (get(data, 'added.round.win_team')) {
      const bombStatus = get(data, 'round.bomb');
      const winner = get(data, 'round.win_team');

      const roundEndData = {
        raw: data,
        score: {
          CT: (0 + (winner === 'CT')) + get(data, 'map.team_ct.score'),
          T: (0 + (winner === 'T')) + get(data, 'map.team_t.score'),
        },
        winner,
        bombExploded: (bombStatus === 'exploded'),
        bombDefused: (bombStatus === 'defused'),
      };

      /**
       * Round end event
       *
       * @event CsgoEventEmitter#roundEnd
       * @type {object}
       * @property {object} raw - Raw data from GSI
       * @property {object} score - Round scores
       * @property {number} score.CT - CT score
       * @property {number} score.T - T score
       * @property {string} winner - Winner of the round, 'CT' or 'T' or undefined
       * @property {boolean} bombExploded - Did the bomb explode?
       * @property {boolean} bombDefused - Was the bomb defused?
       */
      this.emit('roundEnd', roundEndData);
    }
  }

  /**
   * Parses map endings from payloads
   *
   * @param {object} data - Payload as JSON object
   * @fires CsgoEventEmitter#mapEnd
   */
  detectMapEnd(data) {
    if (get(data, 'previously.map.phase') === 'live' && get(data, 'map.phase') === 'gameover') {
      const mapEndData = {
        raw: data,
        score: {
          CT: get(data, 'map.team_ct.score'),
          T: get(data, 'map.team_t.score'),
        },
      };

      if (mapEndData.score.CT > mapEndData.score.T) {
        mapEndData.winner = 'CT';
      } else if (mapEndData.score.T > mapEndData.score.CT) {
        mapEndData.winner = 'T';
      }

      /**
       * Map end event
       *
       * @event CsgoEventEmitter#mapEnd
       * @type {object}
       * @property {object} raw - Raw data from GSI
       * @property {object} score - Round scores
       * @property {number} score.CT - CT score
       * @property {number} score.T - T score
       * @property {string} winner - Winner of the map, 'CT' or 'T' or undefined if the map ended in a draw
       */
      this.emit('mapEnd', mapEndData);
    }
  }

  /**
   * Parses bomb explosions from payloads
   *
   * @param {object} data - Payload as JSON object
   * @fires CsgoEventEmitter#bombExplosion
   */
  detectBombExplosion(data) {
    if (get(data, 'added.round.win_team')) {
      const bombStatus = get(data, 'round.bomb');

      if (bombStatus === 'exploded') {
        const bombExplosionData = { raw: data };

        /**
         * Bomb explosion event
         *
         * @event CsgoEventEmitter#bombExplosion
         * @type {object}
         * @property {object} raw - Raw data from GSI
         */
        this.emit('bombExplosion', bombExplosionData);
      }
    }
  }

  /**
   * Parses successful bomb defusions from payloads
   *
   * @param {object} data - Payload as JSON object
   * @fires CsgoEventEmitter#bombDefuse
   */
  detectBombDefuse(data) {
    if (get(data, 'added.round.win_team')) {
      const bombStatus = get(data, 'round.bomb');

      if (bombStatus === 'defused') {
        const bombDefuseData = { raw: data };

        /**
         * Bomb defuse event
         *
         * @event CsgoEventEmitter#bombDefuse
         * @type {object}
         * @property {object} raw - Raw data from GSI
         */
        this.emit('bombDefuse', bombDefuseData);
      }
    }
  }
}

export default CsgoEventEmitter;
