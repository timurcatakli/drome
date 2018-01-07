import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tooltip, Icon, Button, Card } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired
  })
}

const DEFAULT_MESSAGE = 'Results will be displayed here...'

class AnalyzerForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      analyzedContent: DEFAULT_MESSAGE,
      assignContentToHtml: () => ({ __html: this.state.analyzedContent }),
      palindromeCount: null
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { assignContentToHtml, palindromeCount } = this.state
    const palindromeCountLabel =
      palindromeCount !== null
        ? `We found ${palindromeCount} palindromes`
        : 'Results'
    return (
      <Form onSubmit={this.handleSubmit}>
        <Card
          title="Palindrome Analyzer"
          bordered
          style={{ width: '100%', marginBottom: '30px' }}
        >
          <FormItem
            label={
              <span>
                Content{' '}
                <Tooltip title="Paste your paragraph to be analysed for palindrome words.">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: 'Content is required!',
                  whitespace: true
                }
              ]
            })(
              <TextArea
                placeholder="Paste your paragraph"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              Analyze
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Clear
            </Button>
          </FormItem>
        </Card>
        <Card title={palindromeCountLabel} bordered style={{ width: '100%' }}>
          <div
            dangerouslySetInnerHTML={assignContentToHtml()}
            style={{ lineHeight: '36px' }}
          />
        </Card>
      </Form>
    )
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        return new Promise((resolve, reject) => {
          const { content } = values
          const analyzedContent = this.handleContentAnalyze(content)
          if (analyzedContent) {
            resolve(analyzedContent)
          } else {
            reject('An error occured')
          }
        })
          .then(data => {
            this.setState({ analyzedContent: data })
          })
          .catch(error => {
            console.log(error)
          })
      }
      return null
    })
  }

  isPalindrome = str => {
    if (str.length === 0) {
      return false
    }
    const reverseStr = str
      .split('')
      .reverse()
      .join('')
    return reverseStr === str
  }

  cleanAndFormatStr = str => {
    const convertAndFilterLogic = /[\W_]/g
    const lowRegStr = str.toLowerCase().replace(convertAndFilterLogic, '')
    return lowRegStr
  }

  tagAndFormatPalindromeWords = wordsArray => {
    if (!wordsArray.length === 0 || !Array.isArray(wordsArray)) {
      return null
    }
    let palindromeCount = 0
    this.setState({ palindromeCount })
    const result = wordsArray.map(word => {
      const cleanedWord = this.cleanAndFormatStr(word)
      let checkedWord = word
      if (this.isPalindrome(cleanedWord)) {
        this.setState({ palindromeCount: ++palindromeCount })
        checkedWord = `<span style="background-color: #1890ff; padding: 4px; border-radius: 4px; padding-left:12px; padding-right: 12px;">${cleanedWord}</span>`
      }
      return checkedWord
    })
    const joinedResults = result.join(' ')
    return joinedResults
  }

  handleContentAnalyze = content => {
    if (!content) {
      return null
    }
    const wordsArray = content.split(' ')
    const result = this.tagAndFormatPalindromeWords(wordsArray)
    return result
  }

  handleReset = () => {
    this.setState({
      analyzedContent: DEFAULT_MESSAGE,
      palindromeCount: null
    })
    this.props.form.resetFields()
  }
}

AnalyzerForm.propTypes = propTypes
const AnalyzerFormWrapper = Form.create()(AnalyzerForm)
export default AnalyzerFormWrapper
