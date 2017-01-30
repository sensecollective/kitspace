const React    = require('react')
const Markdown = require('react-markdown')
const {
  Container,
} = require('semantic-ui-react')

const Steps = require('./steps')
const UrlSubmit = require('./url_submit')

const TitleBar = require('../title_bar')

const Step2 = React.createClass({
  render() {
    const board = this.props.board
    return (
    <div className='Step Step2'>
      <TitleBar>
        <div className='titleText'>
          {'Submit a project'}
        </div>
      </TitleBar>
      <Container>
        <Steps setStep={this.props.setStep} active={1}/>
        <Markdown className='instructions' source={''} />
        <div className='userInputSegment'>
          <UrlSubmit store={this.props.store} board={board} />
        </div>
      </Container>
    </div>
    )
  },
})

module.exports = Step2