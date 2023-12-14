import { Fragment } from "react";
import EventList from "../components/events/event-list";
import { getFeaturedEvents } from "../helpers/api-util";

function HomePage(props) {
  const { featuredEvents } = props;

  return (
    <Fragment>
      <EventList items={featuredEvents} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      featuredEvents: featuredEvents,
    },
    revalidate: 1800,
  };
}

export default HomePage;
