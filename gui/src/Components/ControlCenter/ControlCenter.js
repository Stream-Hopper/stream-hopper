import React, { useState,useEffect } from 'react';
import{Table,Button,Modal,ModalBody,ModalHeader,ModalFooter,Form, FormGroup, Label, Input, FormText} from 'reactstrap'
// import EventDatabase from '../../EventDatabase.mjs'
import axios from 'axios'

function ControlCenter(){

    const [deviceModal,setDeviceModal] = useState(false)
    const [presetModal,setPresetModal] = useState(false)
    const [triggerModal,setTriggerModal] = useState(false)
    const [deviceData, setDeviceData] = useState([])
    const [presetData,setPresetData] = useState([])
    const [triggerData,setTriggerData] = useState([])
    const [deviceTypeSelction,setDeviceTypeSelction] = useState()
    const toggleDevice = () => setDeviceModal(!deviceModal);
    const togglePreset = () => setPresetModal(!presetModal);
    const toggleTrigger = () => setTriggerModal(!triggerModal);


    function deviceSubmit(){
        axios.post("http://localhost:8080/api/addDevice",{deviceName: `${document.getElementById('deviceName').value}`, deviceLabel: `${document.getElementById('deviceLabel').value}`, deviceType: `${document.getElementById('deviceType').value}`})
        .then(res=>{
            console.log(res,'RESPONSE DEVICE')
            // setDeviceData(res.data)
        })

        toggleDevice()
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
      },[]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getTriggers")
        .then(res=>{
            console.log(res.data,'TRIGGERS LIST')
            setTriggerData(res.data)
        })
      },[]);

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
                    <Input type="select" name="deviceType" id="deviceType" onChange={(e)=>setDeviceTypeSelction(e.target.value)}>
                    <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option>
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
           <Table bordered>
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
                                <td>{i.preset_name}</td>
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
                    <Input type="checkbox" />{' '}
                    Default
                    </Label>
                </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={togglePreset}>Submit</Button>{' '}
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
                    <Input type="select" name="deviceTrigger" id="deviceTrigger">
                    <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="triggerType">Trigger Type:</Label>
                    <Input type="select" name="triggerType" id="TriggerType">
                    <option>Donation</option>
                    <option>Follow</option>
                    <option>Channel Point Redemption</option>
                    <option>Subscription</option>
                    <option>Cheer</option>
                    <option>Chat Message</option>
                    <option>Resub</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="actions">Actions(Static for now):</Label>
                    <Input type="select" name="actions" id="action">
                    <option>setSate</option>
                    <option>togglePower</option>
                    <option>breatheEffect</option>
                    <option>WemoOn</option>
                    <option>WemoOff</option>
                    <option>Chat Message</option>
                    <option>USBon</option>
                    <option>USBoff</option>
                    <option>GPIOon</option>
                    <option>GPIOoff</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="actionInput">Action Input:</Label>
                    <Input type="text" name="actionInput" id="actionInput" placeholder="Action Input" />
                </FormGroup>
                <div>
                    Preset List:
                    {
                    presetData.map((i)=>{
                        return(
                            <ul>
                                <li>{i.preset_name}</li>
                            </ul>
                        )
                    })
                    }  
                </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggleTrigger}>Submit</Button>{' '}
                <Button color="danger" onClick={toggleTrigger}>Cancel</Button>
              </ModalFooter>
            </Modal>
            </div>

        </div>

    )
}

export default ControlCenter