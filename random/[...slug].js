import EventList from "../components/events/event-list";
import { Fragment, useState, useEffect, use } from "react";
import ResultsTitle from "../components/events/results-title";
import Button from "../components/ui/button";
import ErrorAlert from "../components/ui/error-alert";
import { useRouter } from "next/router";
import axios from "axios";

/** This file uses client-side fetching
 * as an exercise. You will need to replace the
 * existing [...slug].js file with this.
 */

function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const filterData = router.query.slug;

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://next-js-training-17377-default-rtdb.firebaseio.com/events.json"
        );
        const rawEvents = response.data;
        const events = [];
        for (const key in rawEvents) {
          events.push({
            id: key,
            ...rawEvents[key],
          });
        }
        setLoadedEvents(events);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return <p className="center">Loading Events...</p>;
  }

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
    numMonth > 12 ||
    error
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

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

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
