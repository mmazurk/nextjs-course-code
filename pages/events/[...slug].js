import { useRouter } from "next/router";
import { getFilteredEvents } from "../../dummy-data";
import EventList from "../../components/events/event-list";
import { Fragment } from "react";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";

function FilteredEventsPage() {
  const router = useRouter();

  const filterData = router.query.slug;

  // this is because the component will render twice;
  // we want to make we show "Loading" on the first render
  if (!filterData) {
    return <p className="center">Loading ...</p>;
  }

  // We only want the first two items in the array
  // The user could enter a URL that is more than two levels deep
  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];
  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  // Something still may have gone wrong, so we need to check
  // Did the user manually enter a non-number for /month/year?
  // are the years or month values out of expected ranges?
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      <Fragment>
        <ErrorAlert>Invalid Filter</ErrorAlert>
        <div className="center">
          <Button link="/events">Show all Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = getFilteredEvents({ year: numYear, month: numMonth });

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

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

export default FilteredEventsPage;
