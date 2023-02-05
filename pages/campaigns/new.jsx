import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../etherium/factory"
import web3 from "../../etherium/web3";

const CampaignNew = () => {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const intInputValidation = (inputString) => {
    if(parseInt(inputString).toString() === "NaN" || inputString.indexOf(".") !== -1){
      throw new Error("Minimum contribution must be whole number.");
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("")
    try {
      intInputValidation(minimumContribution);
      const accounts = await web3.eth.requestAccounts();
      setLoading(true);
      await factory.methods.createCampaign(minimumContribution).send({from: accounts[0]});
      setLoading(false);
      router.push("/")
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
            label="Wei"
            labelPosition="right"
          ></Input>
        </Form.Field>
        {errorMessage && <Message header="Oops!" negative content={errorMessage} />}
        <Button primary loading={isLoading}>Create!</Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
