<a name="CsgoEventEmitter"></a>

## CsgoEventEmitter
CS:GO Game State Integration event emitter that fires custom events based on received payloads. Payloads may be authenticated if so configured

**Kind**: global class  

* [CsgoEventEmitter](#CsgoEventEmitter)
    * [new CsgoEventEmitter(options)](#new_CsgoEventEmitter_new)
    * [.createServer()](#CsgoEventEmitter+createServer)
    * [.processPayload(data)](#CsgoEventEmitter+processPayload)
    * [.detectRoundEnd(data)](#CsgoEventEmitter+detectRoundEnd)
    * [.detectMapEnd(data)](#CsgoEventEmitter+detectMapEnd)
    * [.detectBombExplosion(data)](#CsgoEventEmitter+detectBombExplosion)
    * [.detectBombDefuse(data)](#CsgoEventEmitter+detectBombDefuse)
    * ["data"](#CsgoEventEmitter+event_data)
    * ["roundEnd"](#CsgoEventEmitter+event_roundEnd)
    * ["mapEnd"](#CsgoEventEmitter+event_mapEnd)
    * ["bombExplosion"](#CsgoEventEmitter+event_bombExplosion)
    * ["bombDefuse"](#CsgoEventEmitter+event_bombDefuse)

<a name="new_CsgoEventEmitter_new"></a>

### new CsgoEventEmitter(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.host | <code>string</code> | GSI event recipient server's host |
| options.port | <code>number</code> | GSI event recipient server's port |
| options.authToken | <code>string</code> | [OPTIONAL] Auth token |

<a name="CsgoEventEmitter+createServer"></a>

### csgoEventEmitter.createServer()
Starts listening to incoming GSI payloads

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
<a name="CsgoEventEmitter+processPayload"></a>

### csgoEventEmitter.processPayload(data)
Processes payloads to parse game events

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Emits**: [<code>data</code>](#CsgoEventEmitter+event_data)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Payload as JSON object |

<a name="CsgoEventEmitter+detectRoundEnd"></a>

### csgoEventEmitter.detectRoundEnd(data)
Parses round endings from payloads

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Emits**: [<code>roundEnd</code>](#CsgoEventEmitter+event_roundEnd)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Payload as JSON object |

<a name="CsgoEventEmitter+detectMapEnd"></a>

### csgoEventEmitter.detectMapEnd(data)
Parses map endings from payloads

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Emits**: [<code>mapEnd</code>](#CsgoEventEmitter+event_mapEnd)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Payload as JSON object |

<a name="CsgoEventEmitter+detectBombExplosion"></a>

### csgoEventEmitter.detectBombExplosion(data)
Parses bomb explosions from payloads

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Emits**: [<code>bombExplosion</code>](#CsgoEventEmitter+event_bombExplosion)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Payload as JSON object |

<a name="CsgoEventEmitter+detectBombDefuse"></a>

### csgoEventEmitter.detectBombDefuse(data)
Parses successful bomb defusions from payloads

**Kind**: instance method of [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Emits**: [<code>bombDefuse</code>](#CsgoEventEmitter+event_bombDefuse)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Payload as JSON object |

<a name="CsgoEventEmitter+event_data"></a>

### "data"
Raw data event of CS:GO GSI. Listen to this if you wish to implement additional parsing of your own.

**Kind**: event emitted by [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>object</code> | Raw data from GSI |

<a name="CsgoEventEmitter+event_roundEnd"></a>

### "roundEnd"
Round end event

**Kind**: event emitted by [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>object</code> | Raw data from GSI |
| score | <code>object</code> | Round scores |
| score.CT | <code>number</code> | CT score |
| score.T | <code>number</code> | T score |
| winner | <code>string</code> | Winner of the round, 'CT' or 'T' or undefined |
| bombExploded | <code>boolean</code> | Did the bomb explode? |
| bombDefused | <code>boolean</code> | Was the bomb defused? |

<a name="CsgoEventEmitter+event_mapEnd"></a>

### "mapEnd"
Map end event

**Kind**: event emitted by [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>object</code> | Raw data from GSI |
| score | <code>object</code> | Round scores |
| score.CT | <code>number</code> | CT score |
| score.T | <code>number</code> | T score |
| winner | <code>string</code> | Winner of the map, 'CT' or 'T' or undefined if the map ended in a draw |

<a name="CsgoEventEmitter+event_bombExplosion"></a>

### "bombExplosion"
Bomb explosion event

**Kind**: event emitted by [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>object</code> | Raw data from GSI |

<a name="CsgoEventEmitter+event_bombDefuse"></a>

### "bombDefuse"
Bomb defuse event

**Kind**: event emitted by [<code>CsgoEventEmitter</code>](#CsgoEventEmitter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| raw | <code>object</code> | Raw data from GSI |

