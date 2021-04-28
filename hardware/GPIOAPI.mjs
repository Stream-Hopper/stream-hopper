import util from 'util';
const exec = util.promisify(child_process.exec);

class GPIOAPI{
    async toggle(port, mode){
        await exec(`python gpio.py ${port} ${mode}`);
    }
}

const gpio = new GPIOAPI();
gpio.toggle(1, 1);