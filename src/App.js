import React, { Component } from 'react'
import IconexConnect from './IconexConnect';
import {
  IconConverter
} from 'icon-sdk-js'
import SDK from './SDK';
import config from './config';
import './App.css';

const LABEL = {
  0: 'WHITE',
  1: 'RED',
  2: 'ORANGE',
  3: 'YELLOW',
  4: 'LIME GREEN',
  5: 'KELLY GREEN',
  6: 'SKY BLUE',
  7: 'ROYAL BLUE',
  8: 'VIOLET',
  9: 'PINK',
  10: 'BROWN',
  11: 'GRAY',
  12: 'BLACK'
}

const COLOR = {
  0: '#f1f1f1',
  1: '#ff5349',
  2: '#ff6600',
  3: '#fff222',
  4: '#32cd32',
  5: '#01a263',
  6: '#00ccff',
  7: '#4169e1',
  8: '#9400d3',
  9: '#ff78cb',
  10: '#654321',
  11: '#c2c5cc',
  12: '#333333'
}

export default class App extends Component {
  state = {
    colour: 0,
    isLoggedIn: false,
    address: '',
  }
  
  handleChange = (e) => {
    this.setState({
      colour: e.target.value
    })
  }

  handleLogIn = async (e) => {
    const myAddress = await IconexConnect.getAddress()
    const colour = await SDK.iconService.call(
      SDK.callBuild({
        methodName: 'get_mood_code',
        params: {
          address: myAddress
        },
        to: config.CONTRACT_ADDRESS,
      })
    ).execute()
    console.log(colour)
    this.setState({
      myAddress,
      isLoggedIn: true,
      colour: Number(colour) || 0
    })
  }

  handleSubmit = async () => {
    const { sendTxBuild } = SDK
    const { colour, myAddress } = this.state
    const txObj = sendTxBuild({
      from: myAddress,
      to: config.CONTRACT_ADDRESS,
      methodName: 'set_mood_code',
      params: {
        code: IconConverter.toHex(Number(colour)), 
      },
    })
    // const txObj = sendTxBuild({
    //   from: myAddress,
    //   to: config.CONTRACT_ADDRESS,
    //   methodName: 'add_movie',
    //   params: {
    //     idx: IconConverter.toHex(id),
    //   },
    // })
    const tx = await IconexConnect.sendTransaction(txObj)
    alert('오늘의 색깔이 등록되었습니다.')
  }

  render() {
    const { colour, isLoggedIn } = this.state
    return (
      <div className="App" style={{background: COLOR[colour]}}>
        <div className="logo">
          colourBlock
          {
            isLoggedIn ? (
              <>
                <select onChange={this.handleChange} defaultValue={0} style={{ marginLeft: 20, marginBottom: 20, marginRight: 10, height: '22px'}} name="colour">
                    {
                      Object.values(LABEL).map((val, i) => {
                        return <option key={i} value={i}>{val}</option>
                      })
                    }
                  </select>
                <button onClick={this.handleSubmit}>등록</button>
              </>
            ) : (
              <button style={{ marginLeft: 20 }} onClick={this.handleLogIn}>로그인</button>
            )
          }
        </div>
        <div className="App-header">
          { LABEL[colour] }
        </div>
        <div style={{position: 'fixed', fontSize: 9, width: '100vw', margin: '0 auto', bottom: 30}}>inspired by <a href="https://graf1x.com/color-psychology-emotion-meaning-poster/">https://graf1x.com/color-psychology-emotion-meaning-poster/</a></div>
      </div>
    );
  }
}
