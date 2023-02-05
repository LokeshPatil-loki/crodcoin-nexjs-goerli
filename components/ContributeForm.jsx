const { Form, Label, Input, Button } = require("semantic-ui-react")

const ContributeFrom = () => {
  return <Form>
    <h3>Contribute to this campaign!</h3>
    <Form.Field>
      <label>Amount to Contribute</label>
      <Input label="ether" labelPosition="right"/>
    </Form.Field>
    <Button primary>Contribute!</Button>
  </Form>
}

export default ContributeFrom;