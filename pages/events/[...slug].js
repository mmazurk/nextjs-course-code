import { getFilteredEvents } from "../../helpers/api-util";
import EventList from "../../components/events/event-list";
import { Fragment } from "react";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

function FilteredEventsPage(props) {
  if (props.hasError) {
    return (
      <Fragment>
        <ErrorAlert>Invalid Filter</ErrorAlert>
        <div className="center">
          <Button link="/events">Show all Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = props.events;

  // before we proceed, we need to see if we found anything
  // we might have searched our data source and found zero events
  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>No Events Found!</ErrorAlert>
        <div className="center">
          <Button link="/events">Show all Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const filterData = params.slug;

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];
  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return {
      props: { hasError: true },
    };
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
}

export default FilteredEventsPage;
