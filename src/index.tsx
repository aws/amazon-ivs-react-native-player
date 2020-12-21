import { NativeModules } from 'react-native';

type AmazonIvsType = {
  multiply(a: number, b: number): Promise<number>;
};

const { AmazonIvs } = NativeModules;

export default AmazonIvs as AmazonIvsType;
