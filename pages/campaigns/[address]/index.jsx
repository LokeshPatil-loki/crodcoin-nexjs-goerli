import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Button, Card, Grid, GridColumn } from "semantic-ui-react";
import Campaign from "@/etherium/campaign";
import web3 from "@/etherium/web3";
import ContributeFrom from "@/components/ContributeForm";
import Link from "next/link";

const CampaignShow = ({ campaignSummary }) => {
  const renderCards = () => {
    const { balance, manager, minimumContribution, requestsCount, approversCount } =
      campaignSummary;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute at least this much wei to become an approver.",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from contract. Request must be approved by approvers.",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "Number of peoples who have already donated to this campaign.",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (Ether)",
        description: "The balance is how much money this campaign has left to spend.",
      },
    ];
    return <Card.Group items={items} />;
  };

  const router = useRouter();
  const address = router.query.address;
  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeFrom address={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button color="black">View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
        
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async ({ query }) => {
  const campaign = Campaign(query.address);
  const campaignSummary = await campaign.methods.getSummary().call();
  return {
    campaignSummary: {
      minimumContribution: campaignSummary[0],
      balance: campaignSummary[1],
      requestsCount: campaignSummary[2],
      approversCount: campaignSummary[3],
      manager: campaignSummary[4],
    },
    campaign,
  };
};

export default CampaignShow;
