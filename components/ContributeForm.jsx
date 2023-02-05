import { useState } from "react";
import web3 from "@/etherium/web3";
import Campaign from "@/etherium/campaign";
import { useRouter } from "next/router";


const { Form, Message, Input, Button } = require("semantic-ui-react");

const ContributeFrom = ({ address }) => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const intInputValidation = (inputString) => {
    if(parseFloat(inputString).toString() === "NaN"){
      throw new Error("Contribution amount must a number.");
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      intInputValidation(amount);
      const value = web3.utils.toWei(amount, 'ether');
      const accounts = await web3.eth.requestAccounts();
      const campaign = Campaign(address);
      setLoading(true);
      await campaign.methods.contribute().send({ from: accounts[0],value });
      setLoading(false);
      router.reload();
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
      console.error(error.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      <h3>Contribute to this campaign!</h3>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Button loading={loading} primary>
        Contribute!
      </Button>
      {errorMessage && (
        <Message negative header="Oops!" content={errorMessage} />
      )}
    </Form>
  );
};

export default ContributeFrom;
