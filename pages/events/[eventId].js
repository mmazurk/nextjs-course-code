import { Fragment } from "react";
import { getFeaturedEvents, getEventById } from "../../helpers/api-util";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";

function EventDetail(props) {
  const { event } = props;

  if (!event) {
    return <ErrorAlert>No events found!</ErrorAlert>;
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

// get static props
export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);

  return {
    props: {
      event: event,
    },
    revalidate: 1800,
  };
}

// get static paths
export async function getStaticPaths() {
  const allEvents = await getFeaturedEvents();
  const paths = allEvents.map((item) => ({
    params: {
      eventId: item.id,
    },
  }));

  return {
    paths: paths,
    fallback: "blocking",
  };
}

export default EventDetail;
