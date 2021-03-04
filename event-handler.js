// Event handler to take incoming api messages to send out triggers


//|////////////////////////////////////////////////
//  Definitions
//|////////////////////////////////////////////////

/* Dictionary to hold triggers received from GUI
 * - values are lists containing all devices for a trigger
 */
var triggerDict = Object();

//|////////////////////////////////////////////////
//  Function Definitions
//|////////////////////////////////////////////////

/* Sends message to hardware layer with relevant information on which
 * devices need to be triggered
 */
function TxHardwareLayer(deviceInformation) {
    // send message to hardware layer however @Justin requests
}

/* Trimms the incoming API message to only send of necessary
 * information to the hardware layer
 */
function trimData(apiMessage) {
    // trim api call here
    return trimmedApiMessage;
}

/* Incoming API message is matched to triggers set
 * by the GUI, then sends triggers based off matches
 */
function findTriggerMatch(apiMessage) {
    if apiMessage.Name in triggerDict {
        for device in triggerDict[apiMessage.Name] {
            TxHardwareLayer(trimData(device));
        }
    }
}

