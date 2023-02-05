import React from "react";
import campaignFactory from "../etherium/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

const CampaignIndex = ({ campaigns }) => {
  const router = useRouter();
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <Button floated="right" primary content="Create Campaign" icon="add" />
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

CampaignIndex.getInitialProps = async (ctx) => {
  const campaigns = await campaignFactory.methods.getDeployedCampaign().call();
  return { campaigns };
};

export default CampaignIndex;
