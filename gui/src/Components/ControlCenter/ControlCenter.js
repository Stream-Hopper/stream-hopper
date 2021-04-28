import React, { useState,useEffect } from 'react';
import{Table,Button,Modal,ModalBody,ModalHeader,ModalFooter,Form, FormGroup, Label, Input, FormText} from 'reactstrap'
// import EventDatabase from '../../EventDatabase.mjs'
import axios from 'axios'

function ControlCenter(){

    const [deviceModal,setDeviceModal] = useState(false)
    const [presetModal,setPresetModal] = useState(false)
    const [triggerModal,setTriggerModal] = useState(false)
    const [deviceData, setDeviceData] = useState([])
    const [deviceId,setDeviceId] = useState()
    const [deviceTypeId, setDeviceTypeId] = useState()
    const [triggerTypeId,setTriggerTypeId] = useState()
    const [actionId,setActionId] = useState()
    const [triggerId,setTriggerId] = useState()
    const [presetData,setPresetData] = useState([])
    const [triggerData,setTriggerData] = useState([])
    const [triggerTypeData,setTriggerTypeData] = useState([])
    const [deviceTypeData,setDeviceTypeData] = useState([])
    const [actionsData,setActionsData] = useState([])
    const [deviceTypeSelction,setDeviceTypeSelction] = useState()
    const [presetSelection,setPresetSelection] = useState([])
    const toggleDevice = () => setDeviceModal(!deviceModal);
    const togglePreset = () => setPresetModal(!presetModal);
    const toggleTrigger = () => setTriggerModal(!triggerModal);

    console.log(presetSelection,'THIS IS THE LIST')


    function deviceSubmit(){
        axios.post("http://localhost:8080/api/addDevice",{deviceName: `${document.getElementById('deviceName').value}`, deviceLabel: `${document.getElementById('deviceLabel').value}`, deviceType: deviceTypeId})
        .then(res=>{
            console.log(res,'RESPONSE DEVICE')
            toggleDevice()
        })

    }
    function presetSubmit(){
        axios.post("http://localhost:8080/api/addPresets",{presetName: `${document.getElementById('presetName').value}`, defaultPreset: document.getElementById("defaultPreset").checked? 1:0 })
        .then(res=>{
            console.log(res,'RESPONSE PRESET')
            togglePreset()
        })

    }

    // function getActionsPerDevice(id){
    //     axios.get()
    // }

    function triggerSubmit(){
        axios.post("http://localhost:8080/api/addTriggers",{triggerName: `${document.getElementById('triggerName').value}`, deviceId: deviceId, triggerTypeId: triggerTypeId, triggerActionId: actionId,options: `${document.getElementById('actionInput').value}`})
        .then(res=>{
            console.log(res.data,'RESPONSE TRIGGER SUBMIT')
            toggleTrigger()
        })

        axios.post("http://localhost:8080/api/getTriggerIdForName",{triggerName: `${document.getElementById('triggerName').value}`})
        .then(res=>{
            console.log(res.data[0].trigger_id,'RESPONSE ID FOR TRIGGER')
            let triggerId= res.data[0].trigger_id
            setTriggerId(triggerId)
            // helperFunction(triggerId)
            // toggleTrigger()
        })

        // console.log(`${document.getElementById('triggerName').value}`,'BULLSHIT')

        
    }

    
    function handleDeviceOnchange(e){
        setDeviceId(e.target.value.split('.')[0])
        console.log(e.target.value.split('.')[0],"TEST SELECTION")
    }

    function handleTriggerTypeOnchange(e){
        setTriggerTypeId(e.target.value.split('.')[0])
        console.log(e.target.value.split('.')[0],'TRIGGER TYPE ID')
    }

    function handleDeviceTypeOnChange(e){
        setDeviceTypeId(e.target.value.split('.')[0])
        console.log(e.target.value.split('.')[0],'DEVICE TYPE ID SELCTION')
    }

    function handleActionOnChange(e){
        setActionId(e.target.value.split('.')[0])
        console.log(e.target.value.split('.')[0],'ACTION ID SELECTION')
    }

    function handlePresetSelection(e){
        let ret = []
        for (var i=0; i < e.options.length; i++) {
            if (e.options[i].selected) {
                ret.push(e.options[i].value.split('.')[0]);
            }
        }
        setPresetSelection(ret)
        console.log(ret,'FUUUUCKKCKCKCKCK')

    }

    function handlePresetClick(e){
        console.log(e.innerHTML.split('.')[0],"THIS SHIT IS CLICKED")
        axios.post("http://localhost:8080/api/getTriggersPerPreset",{presetId: `${e.innerHTML.split('.')[0]}`})
        .then(res=>{
            console.log(res.data,'TRIGGERS LIST FOR EACH PRESET')
        })
    }


   
    useEffect(() => {
        axios.get("http://localhost:8080/api/getDevices")
        .then(res=>{
            console.log(res.data,'DEVICE LIST')
            setDeviceData(res.data)
        })
      },[deviceModal]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getPresets")
        .then(res=>{
            console.log(res.data,'PRESET LIST')
            setPresetData(res.data)
        })
      },[presetModal]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getTriggers")
        .then(res=>{
            console.log(res.data,'TRIGGERS LIST')
            setTriggerData(res.data)
        })
      },[triggerModal]);

      useEffect(() => {
        axios.post("http://localhost:8080/api/getActionsPerDevice",{id: deviceId})
        .then(res=>{
            console.log(res.data,'ACTIONS LIST')
            setActionsData(res.data)
        })
      },[deviceId]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getTriggerType")
        .then(res=>{
            // console.log(res.data,'ACTIONS LIST')
            setTriggerTypeData(res.data)
        })
      },[]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getDeviceType")
        .then(res=>{
            console.log(res.data,'DEVICE TYPE LIST')
            setDeviceTypeData(res.data)
        })
      },[]);

      useEffect(()=>{
        for(let i=0; i<presetSelection.length;i++){
            axios.post("http://localhost:8080/api/triggerPresetMap",{triggerId: triggerId,presetId: presetSelection[i]})
            .then(res=>{
                console.log(res.data,"MAPPING CONFIRMED")
            })
            // console.log(triggerId,'CRAPPPPP')
        }
      },[triggerId])



    return(

        <div>
           <div style={{width:"30%",display:"inline-block",margin:"10px"}}>
           <Table bordered>
            <thead>
                <tr>
                <th>Devices</th>
                </tr>
            </thead>
            <tbody>
                {/* <tr>
                <td>Mark</td>
                </tr>
                <tr>
                <td>Jacob</td>
                </tr>
                <tr>
                <td>Larry</td>
                </tr> */}
                {
                    deviceData.map((i)=>{
                        return(
                            <tr>
                                <td>{i.device_name}</td>
                            </tr>
                        )
                    })
                }
                <tr>
                <td><button onClick={()=>{setDeviceModal(true)}}>Add a Device</button></td>
                </tr>
            </tbody>
            </Table>
            <Modal isOpen={deviceModal} toggle={toggleDevice}>
              <ModalHeader toggle={toggleDevice}>Configure Device</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="deviceName">Device Name</Label>
                    <Input type="text" name="deviceName" id="deviceName" placeholder="Device Name" required/>
                </FormGroup>
                <FormGroup>
                    <Label for="deviceLabel">Device Label</Label>
                    <Input type="text" name="deviceLabel" id="deviceLabel" placeholder="Device Label" />
                </FormGroup>
                <FormGroup>
                    <Label for="deviceType">Device Type</Label>
                    <Input type="select" name="deviceType" id="deviceType" onChange={(e)=>handleDeviceTypeOnChange(e)}>
                    {/* <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option> */}
                    {
                        deviceTypeData.map((i)=>{
                            return(
                                <option>
                                    {i.device_type_id}. {i.name}
                                </option>
                            )
                        })
                    }
                    </Input>
                </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="primary" onClick={toggleDevice}>Submit</Button>{' '} */}
                <Button color="primary" onClick={()=>{deviceSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={toggleDevice}>Cancel</Button>
              </ModalFooter>
            </Modal>
           </div> 
           {/* Preset table */}
           <div style={{width:"30%",display:"inline-block",margin:"10px"}}>
           <Table bordered hover>
                <thead>
                    <tr>
                    <th>Presets</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                    <td>Mark</td>
                    </tr>
                    <tr>
                    <td>Jacob</td>
                    </tr>
                    <tr>
                    <td>Larry</td>
                    </tr> */}
                    {
                    presetData.map((i)=>{
                        return(
                            <tr>
                                <td onClick={(e)=>{handlePresetClick(e.target)}}>{i.preset_id}. {i.preset_name}</td>
                            </tr>
                        )
                    })
                    }   
                    <tr>
                    <td><button onClick={()=>{setPresetModal(true)}}>Add a Preset</button></td>
                    </tr>
                </tbody>
                </Table>
                <Modal isOpen={presetModal} toggle={togglePreset}>
              <ModalHeader toggle={togglePreset}>Configure Device</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="presetName">Preset Name</Label>
                    <Input type="text" name="presetName" id="presetName" placeholder="Preset Name" />
                </FormGroup>
                <div>
                    Trigger List:
                </div>
                <FormGroup check>
                    <Label check>
                    <Input type="checkbox" id="defaultPreset"/>{' '}
                    Default
                    </Label>
                </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={()=>{presetSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={togglePreset}>Cancel</Button>
              </ModalFooter>
            </Modal>
           </div>
           {/* Trigger Table */}
            <div style={{width:"30%",display:"inline-block",margin:"10px"}}>
            <Table bordered>
                <thead>
                    <tr>
                    <th>Triggers</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                    <td>Mark</td>
                    </tr>
                    <tr>
                    <td>Jacob</td>
                    </tr>
                    <tr>
                    <td>Larry</td>
                    </tr> */}
                    {
                    triggerData.map((i)=>{
                        return(
                            <tr>
                                <td>{i.trigger_name}</td>
                            </tr>
                        )
                    })
                     }      
                    <tr>
                    <td><button onClick={()=>{toggleTrigger()}}>Add a Trigger</button></td>
                    </tr>
                </tbody>
                </Table>
                <Modal isOpen={triggerModal} toggle={toggleTrigger}>
              <ModalHeader toggle={toggleTrigger}>Configure Device</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="triggerName">Trigger Name</Label>
                    <Input type="text" name="triggerName" id="triggerName" placeholder="Trigger Name" />
                </FormGroup>
                <FormGroup>
                    <Label for="deviceTrigger">Devices:</Label>
                    <Input type="select" name="deviceTrigger" id="deviceTrigger" onChange={(e)=>{handleDeviceOnchange(e)}}>
                    {/* <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option> */}
                    {
                    deviceData.map((i)=>{
                        return(
                            <option onSelect={()=>{setDeviceId(i.device_id)}}>
                               {i.device_id}. {i.device_name}
                            </option>
                        )
                    })
                    }
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="triggerType">Trigger Type:</Label>
                    <Input type="select" name="triggerType" id="TriggerType" onChange={(e)=>{handleTriggerTypeOnchange(e)}}>
                    {/* <option>Donation</option>
                    <option>Follow</option>
                    <option>Channel Point Redemption</option>
                    <option>Subscription</option>
                    <option>Cheer</option>
                    <option>Chat Message</option>
                    <option>Resub</option> */}
                    {
                        triggerTypeData.map((i)=>{
                            return(
                                <option>
                                {i.trigger_type_id}. {i.trigger_type_name}
                                </option>
                            )
                        })
                    }
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="actions">Actions(Static for now):</Label>
                    <Input type="select" name="actions" id="action" onChange={(e)=>{handleActionOnChange(e)}}>
                    {/* <option>setSate</option>
                    <option>togglePower</option>
                    <option>breatheEffect</option>
                    <option>WemoOn</option>
                    <option>WemoOff</option>
                    <option>Chat Message</option>
                    <option>USBon</option>
                    <option>USBoff</option>
                    <option>GPIOon</option>
                    <option>GPIOoff</option> */}
                    {
                        actionsData.map((i)=>{
                            return(
                                <option>
                                    {i.trigger_action_id}. {i.action}
                                </option>
                            )
                        })
                    }
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="actionInput">Action Input:</Label>
                    <Input type="text" name="actionInput" id="actionInput" placeholder="Action Input" />
                </FormGroup>
                <div>
                Preset List:
                <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple onChange={(e)=>{handlePresetSelection(e.target)}}>
                    {
                    presetData.map((i)=>{
                        return(
                            <option>
                               {i.preset_id}. {i.preset_name}
                            </option>
                        )
                    })
                    }  
                </Input>
                </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={()=>{triggerSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={toggleTrigger}>Cancel</Button>
              </ModalFooter>
            </Modal>
            </div>

        </div>

    )
}

export default ControlCenter