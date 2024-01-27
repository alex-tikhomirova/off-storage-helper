<template>
  <video  ref="scanner" ></video>
</template>

<script setup>

import {BrowserMultiFormatReader} from '@zxing/library';
import {onBeforeUnmount, ref} from "vue";

/*const hints = new Map();
const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX/!*, ...*!/];

hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
const reader = new MultiFormatReader();

const luminanceSource = new RGBLuminanceSource(imgByteArray, imgWidth, imgHeight);
const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

reader.decode(binaryBitmap, hints);*/

const emit = defineEmits(['decode'])
const loaded = ref(false)
const scanner = ref(null)

const codeReader = new BrowserMultiFormatReader()
onBeforeUnmount(() => codeReader.reset())

const scan = (device) => {
  codeReader.decodeFromVideoDevice(device.deviceId, scanner.value, decode)
}

const decode = (result, error) => {
  if (result) {
    emit("decode", result.text);
  }
}

codeReader.listVideoInputDevices().then(scan)

</script>

<style scoped>
video{
  border: 1px solid #CCCCCC;
  width: 100%;
  max-width: 400px;
}
</style>