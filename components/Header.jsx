import { Menu, Icon } from "semantic-ui-react";
import Link from "next/link";

export default () => {
  return (
    <Menu style={{ margin: "10px auto 20px" }}>
      <Link className="item" href={"/"}>
        CrowdCoin
      </Link>
      <Menu.Menu position="right">
      <Link className="item" href={"/"}>
      Campaigns
      </Link>
        <Link className="item" href={"/campaigns/new"}>
          <Icon name="plus" />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
