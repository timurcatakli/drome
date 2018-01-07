import React, { Component } from 'react'
import { Layout } from 'antd'
import './App.css'
import AnalyzerForm from './AnalyzerForm'

const { Content, Footer } = Layout
class App extends Component {
  render() {
    return (
      <Layout className="app">
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            <AnalyzerForm />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Palindrome Analyzer  © 2018 Created by Timur Catakli
        </Footer>
      </Layout>
    )
  }
}

export default App
