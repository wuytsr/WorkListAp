Ext.define('FlightsUnlimited.api.Xml', {
	requires: ['FlightsUnlimited.model.Flight', 'FlightsUnlimited.model.Booking', 'FlightsUnlimited.store.Bookings', 'FlightsUnlimited.model.TravelAgency', 'Ext.DateExtras'],
	singleton: true,

	flight: null,
	availableFlights: null,
	allFlights: null,

	booking: null,
	bookings: null,
	travelAgent: null,

	flightKey: function (carrier, flight, date) {
		var fd = Ext.Date.format(date, "Y-m-d") + "T00:00:00";
		return Ext.String.format("AirLineID='{0}',FlightConnectionID='{1}',FlightDate=datetime'{2}'", carrier, flight, fd);
	},

	bookingKey: function (carrier, flight, date, booking) {
		return this.flightKey(carrier, flight, date) + ",BookingID='" + booking + "'";
	},

	confirmBooking: function (carrier, booking, scope, callback) {

	},

	downloadBooking: function (carrier, flight, date, booking, scope, callback) {
		if (this.booking === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'downloadBooking',
				msg: 'A download for a booking is already in progress'
			});
		}

		// Cache the last operation to improve performance
		// but only if the key matches
		if (this.booking && this.booking.get('AirLineID') == carrier && this.booking.get('BookingID' == booking) && this.booking.get('CarrierID') == carrier && this.booking.get('FlightDate') == date) {
			return this.booking;
		}

		// marks getting the flight as in transition
		// since the request is asynchronous
		this.booking = undefined;

		// finally load the object
		var BookingModel = Ext.ModelManager.getModel('FlightsUnlimited.model.Booking');
		BookingModel.load(this.bookingKey(carrier, flight, date, booking), {
			scope: this,
			callback: function (record, operation) {
				this.booking = record;
				Ext.callback(callback, scope, [this.booking, operation.error]);
			}
		});
	},

	downloadFlight: function (carrier, connection, date, scope, callback) {
		// if there is a flight global already defined and
		// it is the same one return that instance
		if (this.flight === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'downloadFlight',
				msg: 'A download for a flight is already in progress'
			});
		}

		// Cache the last operation to improve performance
		// but only if the key matches
		if (this.flight && this.flight.get('AirLineID') == carrier && this.flight.get('FlightConnectionID' == connection) && this.flight.get('FlightDate') == date) {
			return this.flight;
		}

		// marks getting the flight as in transition
		// since the request is asynchronous
		this.flight = undefined;

		// finally load the object
		var FlightModel = Ext.ModelManager.getModel('FlightsUnlimited.model.Flight');
		FlightModel.load(this.flightKey(carrier, connection, date), {
			scope: this,
			callback: function (record, operation) {
				this.flight = record;
				Ext.callback(callback, scope, [this.flight, operation.error]);
			}
		});
	},

	downloadBookings: function (carrier, connection, date, scope, callback) {
		if (this.bookings === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'downloadBookings',
				msg: 'a download for the booking list is already in progress'
			});
		}

		// TODO: Need to put in caching code for a flight store
		// marks getting the booking as in transition
		// since the request is asynchronous
		this.bookings = undefined;

		var key = this.flightKey(carrier, connection, date),
			store = Ext.create('FlightsUnlimited.store.Bookings', {
				model: 'FlightsUnlimited.model.Booking',
				storeId: 'flight-bookings',
				proxy: {
					type: 'odata',
					enablePagingParams: true,
					withCredentials: true,
					username: 'GW@ESW',
					password: 'ESW4GW',
					extraParams: {
						"$select": "AirLineID,FlightConnectionID,FlightDate,BookingID,PassengerName"
					},
					url: 'http://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2/FlightCollection(' + key + ')/FlightBookings',
					reader: {
						type: 'xml',
						rootProperty: 'feed',
						record: 'properties'
					},
					listeners: {
						'exception': function (proxy, response, operation) {
							FlightsUnlimited.api.Error.alert(response);
						}
					}
				}
			});

		this.bookings = store;
		Ext.callback(callback, scope, [store]);
	},

	getAvailableFlights: function (cityFrom, dateFrom, cityTo, dateTo, scope, callback) {
		if (this.availableFlights === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'availableFlights',
				msg: 'a download for the avaliableFlights is already in progress'
			});
		}

		this.availableFlights = undefined;

		var params = {
			"FromDate": "datetime'" + Ext.Date.format(dateFrom, "Y-m-d\\TH:i:s") + "'",
			"ToDate": "datetime'" + Ext.Date.format(dateTo, "Y-m-d\\TH:i:s") + "'",
			"DestinationCity": "'" + cityTo.toUpperCase() + "'",
			"DepartureCity": "'" + cityFrom.toUpperCase() + "'",
			"$select": "AirLineID,FlightConnectionID,FlightDate,AirFare,LocalCurrencyCode"
		};

		var store = Ext.create('FlightsUnlimited.store.AvailableFlights', {
			model: 'FlightsUnlimited.model.Flight',
			storeId: 'flight-flights',
			proxy: {
				type: 'odata',
				enablePagingParams: true,
				withCredentials: true,
				username: 'GW@ESW',
				password: 'ESW4GW',
				extraParams: params,
				url: "http://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2/GetAvailableFlights",
				reader: {
					type: 'xml',
					rootProperty: 'feed',
					record: 'properties'
				},
				listeners: {
					'exception': function (proxy, response, operation) {
						FlightsUnlimited.api.Error.alert(response);
					}

				}
			}
		});

		this.availableFlights = store;
		Ext.callback(callback, scope, [store]);
	},

	getAllFlights: function (scope, callback) {
		if (this.allFlights === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'getAllFlights',
				msg: 'a download for AllFlights is already in progress'
			});
		}

		this.allFlights = undefined;

		var store = Ext.create('FlightsUnlimited.store.AllFlights', {
			model: 'FlightsUnlimited.model.Flight',
			storeId: 'flight-all',
			proxy: {
				type: 'odata',
				enablePagingParams: true,
				withCredentials: true,
				username: 'GW@ESW',
				password: 'ESW4GW',
				extraParams: {
					"$select": "AirLineID,FlightConnectionID,FlightDate,AirFare,LocalCurrencyCode"
				},
				url: "http://gw.esworkplace.sap.com/sap/opu/odata/IWBEP/RMTSAMPLEFLIGHT_2/FlightCollection",
				reader: {
					type: 'xml',
					rootProperty: 'feed',
					record: 'properties'
				},
				listeners: {
					'exception': function (proxy, response, operation) {
						FlightsUnlimited.api.Error.alert(response);
					}
				}
			}
		});

		this.allFlights = store;
		Ext.callback(callback, scope, [store]);
	},

	downloadTravelAgent: function (travelAgentId, scope, callback) {
		if (this.travelAgent === undefined) {
			Ext.Error.raise({
				sourceClass: 'FlightsUnlimited.api.Xml',
				sourceMethod: 'downloadTravelAgent',
				msg: 'a download for the travelagent is already in progress'
			});
		}

		// TODO: Need to put in caching code for a flight store
		// marks getting the booking as in transition
		// since the request is asynchronous
		this.travelAgent = undefined;

		// Cache the last operation to improve performance
		// but only if the key matches
		if (this.travelAgent && this.travelAgent.get('TravelAgencyID') == travelAgentId) {
			return this.travelAgentId;
		}

		// marks getting the flight as in transition
		// since the request is asynchronous
		this.travelAgent = undefined;

		// finally load the object
		var TravelAgentModel = Ext.ModelManager.getModel('FlightsUnlimited.model.TravelAgency');
		TravelAgentModel.load(travelAgentId, {
			scope: this,
			callback: function (record, operation) {
				this.travelAgent = record;
				Ext.callback(callback, scope, [this.booking, operation.error]);
			}
		});
	},

	downloadCarrier: function (carrierID) {

	}
});