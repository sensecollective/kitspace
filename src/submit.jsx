const Markdown = require('react-markdown')
const Redux    = require('redux')
const React    = require('react')
const { Input, Icon, Step, Container, Form} = require('semantic-ui-react')

const TitleBar  = require('./title_bar')

const initial_state = {
  activeStep: 0,
  url: {
    sent: false,
    reply: null,
  },
}

function reducer(state = initial_state, action) {
  switch(action.type) {
    case 'setStep':
      return Object.assign(state, {activeStep: action.value})
    case 'setUrlSent':
      const url = Object.assign(state.url, {sent: action.value})
      return Object.assign(state, {url})
  }
  return state
}

const store = Redux.createStore(reducer)


const instructionTexts = [
`
- Plot Gerbers (RS274-X) & drill data from your CAD program.
- Put the files into a \`gerbers/\` directory in a publicly accessible git repository
(you could use [GitLab](https://gitlab.com) or [GitHub](https://github.com) for instance).

If you would like to put them somewhere else in your repository please also add a
kitnic.yaml with a field \`gerbers:\` followed by the path to the directory so Kitnic can find it.
Use forward slashes as path seperators, e.g. \`gerbers: hardware/gerbers\`.

Preview your board by entering the repository URL below.
`,
'',
'',
'',
]

function Steps(props) {
    return (
      <div className='stepsContainer'>
        <Step.Group ordered stackable='tablet'>
          <Step active={props.active === 0} onClick={handleClick(0)}>
            Preview the board
          </Step>
          <Step active={props.active === 1} onClick={handleClick(1)}>
            Preview the bill of materials
          </Step>
          <Step active={props.active === 2} onClick={handleClick(2)}>
            Preview the readme
          </Step>
          <Step active={props.active === 3} onClick={handleClick(3)}>
            Send us a pull-request to add your board
          </Step>
        </Step.Group>
      </div>
  )
}

function UrlSubmit(props) {
  const placeholder = 'https://github.com/kitnic-forks/arduino-uno'
  function onSubmit(event, {formData}) {
    event.preventDefault()
    if (props.urlSent) {
      return
    }
    store.dispatch({type:'setUrlSent', value: true})
  }
  return (
    <Form onSubmit={onSubmit} className='previewContainer'>
    <Input
    fluid
    name = 'url'
    action = {{
      color   : 'green',
      content : 'preview',
      loading : props.urlSent,
    }}
    placeholder = {placeholder} />
    </Form>)
}

const Submit = React.createClass({
  getInitialState: function() {
    return store.getState()
  },
  render: function () {
    const state = this.state
    return (
    <div className='Submit'>
      <TitleBar>
        <div className='titleText'>
          Submit a project
        </div>
      </TitleBar>
      <div className='content'>
        <Steps active={state.activeStep} />
        <Markdown className='instructions' source={instructionTexts[state.activeStep]} />
        <UrlSubmit urlSent={state.url.sent} />
      </div>
    </div>
    )
  },
  componentDidMount: function () {
    store.subscribe(() => {
      const state = store.getState()
      console.log(state)
      this.setState(state)
    })
  }
})

function handleClick(step) {
   return () => {
      store.dispatch({type:'setStep', value:step})
   }
}

function submitUrl() {
  store.dispatch({type:'setUrlSent', value:true})
}


module.exports = Submit