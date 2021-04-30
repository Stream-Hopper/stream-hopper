import React, { useState,useEffect } from 'react';
import{Table,Button,Modal,ModalBody,ModalHeader,ModalFooter,Form, FormGroup, Label, Input, FormText} from 'reactstrap'
// import EventDatabase from '../../EventDatabase.mjs'
import axios from 'axios'

function ControlCenter(){

    const [deviceModal,setDeviceModal] = useState(false)
    const [deviceEditModal,setDeviceEditModal] = useState(false)
    const [presetModal,setPresetModal] = useState(false)
    const [presetEditModal,setPresetEditModal] = useState(false)
    const [triggerModal,setTriggerModal] = useState(false)
    const [deviceData, setDeviceData] = useState([])
    const [deviceTypeId, setDeviceTypeId] = useState()
    const [triggerTypeId,setTriggerTypeId] = useState()
    const [triggerEditModal,setTriggerEditModal] = useState(false)
    const [actionId,setActionId] = useState()
    const [triggerId,setTriggerId] = useState()
    const [refreshDevice,setRefreshDevice] = useState(true)
    const [refreshPreset,setRefreshPreset] = useState(true)
    const [refreshTrigger,setRefreshTrigger] = useState(true)
    const [triggerList,setTriggerList] = useState([])
    const [presetData,setPresetData] = useState([])
    const [deviceId,setDeviceId] = useState()
    const [deviceIdEdit,setDeviceIdEdit] = useState()
    const [presetIdEdit,setPresetIdEdit] = useState()
    const [triggerIdEdit,setTriggerIdEdit] = useState()
    const [triggerData,setTriggerData] = useState([])
    const [triggerTypeData,setTriggerTypeData] = useState([])
    const [deviceTypeData,setDeviceTypeData] = useState([])
    const [actionsData,setActionsData] = useState([])
    const [deviceTypeSelction,setDeviceTypeSelction] = useState()
    const [deviceTypeIdEdit,setDeviceTypeIdEdit] = useState()
    const [presetSelection,setPresetSelection] = useState([])
    const toggleDevice = () => setDeviceModal(!deviceModal);
    const togglePreset = () => setPresetModal(!presetModal);
    const toggleTrigger = () => setTriggerModal(!triggerModal);
    const toggleDeviceEdit = () => setDeviceEditModal(!deviceEditModal)
    const togglePresetEdit = () => setPresetEditModal(!presetEditModal)
    const toggleTriggerEdit = () => setTriggerEditModal(!triggerEditModal)

    console.log(presetSelection,'THIS IS THE LIST')

    // console.log(deviceTypeData[0].device_type_id,'MY LOG')


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
            setTriggerList(res.data)
            let presetItems = document.getElementsByClassName('presetItem')
            for(let i =0; i < presetItems.length; i++){
                presetItems[i].style.backgroundColor = 'white'
            }
            e.style.backgroundColor = 'gray'
        })
    }
    
    function handleDeviceDelete(i){
        console.log(i,'BUTTON IS CLICKED')
        axios.post("http://localhost:8080/api/deleteDevice",{deviceId: i})
        .then(res=>{
            // console.log(res.data,'TRIGGERS LIST FOR EACH PRESET')
            // setTriggerList(res.data)
            console.log(res.data,'Delete Response')
            setRefreshDevice(!refreshDevice)
        })
    }

    function handlePresetDelete(e,i){
        e.stopPropagation()
        axios.post("http://localhost:8080/api/deletePreset",{presetId: i})
        .then(res=>{
            // console.log(res.data,'TRIGGERS LIST FOR EACH PRESET')
            // setTriggerList(res.data)
            console.log(res.data,'Delete Response')
            setRefreshPreset(!refreshPreset)
        })
    }

    function hadnleTriggerDelete(i){

        axios.post("http://localhost:8080/api/deleteTrigger",{triggerId: i})
        .then(res=>{
            // console.log(res.data,'TRIGGERS LIST FOR EACH PRESET')
            // setTriggerList(res.data)
            console.log(res.data,'Delete Response')
            setRefreshTrigger(!refreshTrigger)
        })

        axios.post("http://localhost:8080/api/presetPerTrigger",{triggerId: i})
        .then(res=>{
            console.log(res.data,'PRESETS FOR TRIGGERS')
            res.data.forEach(item=>{
                axios.post("http://localhost:8080/api/triggerPresetMapDelete",{triggerId: i,presetId: item.preset_id})
                .then(res=>{
                    // console.log(res.data,"MAPPING CONFIRMED")
                })
            })
        })

    }

    // *******************EDIT FUNCTIONS*******************************

    function handleDeviceEdit(e,i){
        e.stopPropagation()
        setDeviceIdEdit(i)
        axios.post("http://localhost:8080/api/devicePerId",{deviceId: i})
        .then(res=>{
            // console.log(res.data,"MAPPING CONFIRMED")
            // console.log(res.data,'FREAKING EDIT DATA')
            if(res.data.length !==0){
                document.getElementById('deviceNameEdit').value = res.data[0].device_name
                document.getElementById('deviceLabelEdit').value = res.data[0].device_label
                // document.getElementById('deviceTypeEdit').value = `${res.data[0].device_type_id}. ${res.data[0].device_type_name}}`
                // console.log(document.getElementById('deviceTypeEdit'),'LOOKY HERE')
                setDeviceTypeId(res.data[0].device_type)
                let mySelect = document.getElementById('deviceTypeEdit')
                for(let i=0; i<mySelect.options.length;i++){
                    if(mySelect.options[i].value.split('.')[0]==res.data[0].device_type){
                        mySelect.options[i].selected = true;
                        console.log(mySelect.options[i],'ITS THE CHOSEN ONE')

                    }
                }
            }
        })

        toggleDeviceEdit()
    }

    function deviceUpdateSubmit(){
        axios.post("http://localhost:8080/api/deviceUpdate",{deviceId: deviceIdEdit, deviceName: document.getElementById('deviceNameEdit').value, deviceLabel: document.getElementById('deviceLabelEdit').value, deviceType: deviceTypeId })
        .then(res=>{
                console.log(res.data,'UPDATE RESPONSE')
        })
        setRefreshDevice(!refreshDevice)
        toggleDeviceEdit()
    }

    function handlePresetEdit(e,i){
        e.stopPropagation()
        setPresetIdEdit(i)
        axios.post("http://localhost:8080/api/presetPerId",{presetId: i})
        .then(res=>{
            if(res.data.length !==0){
                document.getElementById('presetNameEdit').value = res.data[0].preset_name
                if(res.data[0].default_preset===1){
                    document.getElementById('defaultPresetEdit').checked = true
                }
            }
            console.log(res.data,'PRESET EDIT DATA')
        })

        togglePresetEdit()
    }

    function presetUpdateSubmit(){
        axios.post("http://localhost:8080/api/presetUpdate",{presetId: presetIdEdit, presetName: document.getElementById('presetNameEdit').value, defaultPreset: document.getElementById('defaultPresetEdit').checked?1:0 })
        .then(res=>{
                console.log(res.data,'UPDATE RESPONSE')
        }) 
        setRefreshPreset(!refreshPreset)
        togglePresetEdit()
    }

    function handleTriggerEdit(e,i){
        e.stopPropagation()
        setTriggerIdEdit(i)
        axios.post("http://localhost:8080/api/triggerPerId",{triggerId: i})
        .then(res=>{
            console.log(res.data,'TRIGGER ID DATA')
            if(res.data.length !==0){
                document.getElementById('triggerNameEdit').value = res.data[0].trigger_name
                // DEVICE TRIGGER EDIT
                let mySelect = document.getElementById('deviceTriggerEdit')
                setDeviceId(res.data[0].device_id)
                for(let i=0; i<mySelect.options.length;i++){
                    if(mySelect.options[i].value.split('.')[0]==res.data[0].device_id){
                        mySelect.options[i].selected = true;
                        console.log(mySelect.options[i],'ITS THE CHOSEN ONE')

                    }
                }

                // TRIGGER TYPE EDIT
                let mySelect1 = document.getElementById('TriggerTypeEdit')
                for(let i=0; i<mySelect1.options.length;i++){
                    if(mySelect1.options[i].value.split('.')[0]==res.data[0].trigger_type){
                        mySelect1.options[i].selected = true;
                        console.log(mySelect1.options[i],'ITS THE CHOSEN ONE')

                    }
                }

                // TRIGGER ACTIONS
                let mySelect2 = document.getElementById('actionEdit')
                for(let i=0; i<mySelect2.options.length;i++){
                    if(mySelect2.options[i].value.split('.')[0]==res.data[0].trigger_action_id){
                        mySelect2.options[i].selected = true;
                        console.log(mySelect2.options[i],'ITS THE CHOSEN ONE')

                    }
                }

                // PRESET SELECTION
                let mySelect3 = document.getElementById('presetSelectEdit')
                
                    axios.post("http://localhost:8080/api/presetPerTrigger",{triggerId: i})
                    .then(res=>{
                        res.data.forEach(item=>{
                        for(let i=0; i<mySelect3.options.length;i++){
                            
                            if(mySelect3.options[i].value.split('.')[0]==item.preset_id){
                                mySelect3.options[i].selected = true;
                                console.log(mySelect3.options[i],'ITS THE CHOSEN ONE')
        
                            }
                        }
                        })
                        
                        console.log(res.data,'FUCK THIS')
                    })

                //TRIGGER ACTION INPUT
                
                document.getElementById('actionInputEdit').value = res.data[0].options
            }
        })

        toggleTriggerEdit()
    }

    function triggerUpdateSubmit(){

        axios.post("http://localhost:8080/api/triggerUpdate",{triggerId: triggerIdEdit, triggerName: document.getElementById('triggerNameEdit').value, deviceId: deviceId, triggerType: triggerTypeId, triggerActionId: actionId,options: `${document.getElementById('actionInputEdit').value}` })
        .then(res=>{
                console.log(res.data,'UPDATE RESPONSE')
        }) 
        setRefreshTrigger(!refreshTrigger)
        toggleTriggerEdit()
        
    }

    useEffect(()=>{
        console.log(triggerList,'YOU GETTING IT')
        let triggerDict = Object();
        triggerDict['donation'] = [];
        triggerDict['follow'] = [];
        triggerDict['channelPointRedemption'] = [];
        triggerDict['subscription'] = [];
        triggerDict['cheer'] = [];
        triggerDict['chatMessage'] = [];
        triggerDict['resub'] = [];
        triggerList.forEach(trigger =>{
        axios.post("http://localhost:8080/api/triggerDictPerId",{triggerId: trigger.trigger_id})
        .then(res=>{
            // console.log(res.data[0],'FUCKING DICTIONARY')
            if(res.data.length!==0){

                triggerDict[res.data[0].trigger_type_name].push(res.data[0])
            }
            console.log(triggerDict,'DICTIONARY')

            axios.post("http://localhost:8080/api/receiveDict",{triggerArray: triggerDict})
            .then(res=>{
                console.log(res.data)
            })
        })

        })
    },[triggerList])
    
    // useEffect(()=>{
        //     let triggerDict = Object();
        //     triggerDict['donation'] = [];
        //     triggerDict['follow'] = [];
        //     triggerDict['channelPointRedemption'] = [];
        //     triggerDict['subscription'] = [];
        //     triggerDict['cheer'] = [];
        //     triggerDict['chatMessage'] = [];
    //     triggerDict['resub'] = [];
    // },[])
    

    useEffect(() => {
        axios.get("http://localhost:8080/api/getDevices")
        .then(res=>{
            console.log(res.data,'DEVICE LIST')
            setDeviceData(res.data)
            if(res.data.length!==0){

                setDeviceId(res.data[0].device_id)
            }
        })
      },[deviceModal,refreshDevice]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getPresets")
        .then(res=>{
            console.log(res.data,'PRESET LIST')
            setPresetData(res.data)
        })
      },[presetModal,refreshPreset]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getTriggers")
        .then(res=>{
            console.log(res.data,'TRIGGERS LIST')
            setTriggerData(res.data)
        })
      },[triggerModal,refreshTrigger]);

      useEffect(() => {
        axios.post("http://localhost:8080/api/getActionsPerDevice",{id: deviceId})
        .then(res=>{
            console.log(res.data,'ACTIONS LIST')
            setActionsData(res.data)
            if(res.data.length !== 0){

                setActionId(res.data[0].trigger_action_id)
            }
            // console.log(res.data[0].trigger_action_id,'MOTHERFUCKER')
        })
      },[deviceId]);

      useEffect(() => {
        axios.get("http://localhost:8080/api/getTriggerType")
        .then(res=>{
            // console.log(res.data,'ACTIONS LIST')
            setTriggerTypeData(res.data)
            if(res.data.length!==0){

                setTriggerTypeId(res.data[0].trigger_type_id)
            }
        })
      },[]);

      useEffect(() => {

        axios.get("http://localhost:8080/api/getDeviceType")
        .then(res=>{
            // console.log(res.data,'DEVICE TYPE LIST')
            setDeviceTypeData(res.data)
            if(res.data.length !== 0){

                setDeviceTypeId(res.data[0].device_type_id)
            }
            // console.log(res.data[0],'WTF')
        })
        // console.log(deviceTypeData,'WTF')
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
                                <td>{i.device_id}. {i.device_name}
                                <button type="button" class="close material-icons delete" aria-label="Close" onClick={()=>{handleDeviceDelete(i.device_id)}}>&#xE5C9;</button>
                                <button type="button" class="close material-icons edit" aria-label="Close" onClick={(e)=>{handleDeviceEdit(e,i.device_id)}}>&#xE3C9;</button>
                                </td>
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
                    <Input type="select" name="deviceType" id="deviceType"  onChange={(e)=>handleDeviceTypeOnChange(e)}>
                    {/* <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option> */}
                    { 
                        deviceTypeData.map((i)=>{
                            return(
                                <option>
                                    {i.device_type_id}. {i.device_type_name}
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
                                <td className="presetItem" onClick={(e)=>{handlePresetClick(e.target)}}>{i.preset_id}. {i.preset_name}
                                
                                <button type="button" class="close material-icons delete" aria-label="Close" onClick={(e)=>{handlePresetDelete(e,i.preset_id)}}>&#xE5C9;</button>
                                <button type="button" class="close material-icons edit" aria-label="Close" onClick={(e)=>{handlePresetEdit(e,i.preset_id)}}>&#xE3C9;</button>
                                </td>
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
                                <td>{i.trigger_name}
                                <button type="button" class="close material-icons delete" aria-label="Close" onClick={()=>{hadnleTriggerDelete(i.trigger_id)}}>&#xE5C9;</button>
                                <button type="button" class="close material-icons edit" aria-label="Close" onClick={(e)=>{handleTriggerEdit(e,i.trigger_id)}}>&#xE3C9;</button>
                                </td>
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
              <ModalHeader toggle={toggleTrigger}>Configure Trigger</ModalHeader>
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
                    <Label for="actions">Actions:</Label>
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

            {/* ******************DEVICE EDIT MODAL***************************** */}
            <div>
            <Modal isOpen={deviceEditModal} toggle={toggleDeviceEdit}>
              <ModalHeader toggle={toggleDeviceEdit}>Configure Device</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="deviceName">Device Name</Label>
                    <Input type="text" name="deviceName" id="deviceNameEdit" placeholder="Device Name" required/>
                </FormGroup>
                <FormGroup>
                    <Label for="deviceLabel">Device Label</Label>
                    <Input type="text" name="deviceLabel" id="deviceLabelEdit" placeholder="Device Label" />
                </FormGroup>
                <FormGroup>
                    <Label for="deviceType">Device Type</Label>
                    {/* <Input type="select" name="deviceType" id="deviceTypeEdit" > */}
                    <Input type="select" name="deviceType" id="deviceTypeEdit"  onChange={(e)=>handleDeviceTypeOnChange(e)}>
                    {/* <option>Lifx</option>
                    <option>Wemo</option>
                    <option>USB</option>
                    <option>GPIO</option> */}
                    { 
                        deviceTypeData.map((i)=>{
                            return(
                                <option>
                                    {i.device_type_id}. {i.device_type_name}
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
                <Button color="primary" onClick={()=>{deviceUpdateSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={toggleDeviceEdit}>Cancel</Button>
              </ModalFooter>
            </Modal>
            </div>

            {/* ******************PRESET EDIT MODAL***************************** */}
            <div>
            <Modal isOpen={presetEditModal} toggle={togglePresetEdit}>
              <ModalHeader toggle={togglePresetEdit}>Configure Preset</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="presetNameEdit">Preset Name</Label>
                    <Input type="text" name="presetNameEdit" id="presetNameEdit" placeholder="Preset Name" />
                </FormGroup>
                <div>
                    Trigger List:
                </div>
                <FormGroup check>
                    <Label check>
                    <Input type="checkbox" id="defaultPresetEdit"/>{' '}
                    Default
                    </Label>
                </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={()=>{presetUpdateSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={togglePresetEdit}>Cancel</Button>
              </ModalFooter>
            </Modal>

            </div>

            {/* ******************TRIGGER EDIT MODAL***************************** */}

            <div>
            <Modal isOpen={triggerEditModal} toggle={toggleTriggerEdit}>
              <ModalHeader toggle={toggleTriggerEdit}>Configure Trigger</ModalHeader>
              <ModalBody>
              <Form>
                <FormGroup>
                    <Label for="triggerNameEdit">Trigger Name</Label>
                    <Input type="text" name="triggerNameEdit" id="triggerNameEdit" placeholder="Trigger Name" />
                </FormGroup>
                <FormGroup>
                    <Label for="deviceTrigger">Devices:</Label>
                    <Input type="select" name="deviceTrigger" id="deviceTriggerEdit" onChange={(e)=>{handleDeviceOnchange(e)}}>
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
                    <Input type="select" name="triggerType" id="TriggerTypeEdit" onChange={(e)=>{handleTriggerTypeOnchange(e)}}>
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
                    <Label for="actions">Actions:</Label>
                    <Input type="select" name="actions" id="actionEdit" onChange={(e)=>{handleActionOnChange(e)}}>
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
                    <Input type="text" name="actionInput" id="actionInputEdit" placeholder="Action Input" />
                </FormGroup>
                <div>
                Preset List:
                <Input type="select" name="selectMulti" id="presetSelectEdit" multiple onChange={(e)=>{handlePresetSelection(e.target)}}>
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
                <Button color="primary" onClick={()=>{triggerUpdateSubmit()}}>Submit</Button>{' '}
                <Button color="danger" onClick={toggleTriggerEdit}>Cancel</Button>
              </ModalFooter>
            </Modal>
            </div>

            


        </div>

    )
}

export default ControlCenter
