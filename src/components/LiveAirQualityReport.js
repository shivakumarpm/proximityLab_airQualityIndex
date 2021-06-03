import React from 'react';
import PropTypes from 'prop-types';
import './LiveAirQualityReport.css';

export default class LiveAirQualityReport extends React.Component {
    static defaultProps = {
        aqiInfo: [],
    };

    static propTypes = {
        aqiInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    };

    constructor(props) {
        super(props);
        const currentTime = new Date();
        this.state = {
            aqiInfo: props.aqiInfo,
            lastUpdatedTime: currentTime && currentTime.getTime(),
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.aqiInfo !== state.aqiInfo) {
            const currentTime = new Date();
            const tempAqiInfo = [];   
            props.aqiInfo.forEach((data, index) => {
                let lastModified = '';
                const stateAqi = state.aqiInfo.length && state.aqiInfo[index];
                if (stateAqi && (data.aqi !== stateAqi.aqi)) {
                    const timeDiff = currentTime.getTime() - state.lastUpdated;
                    if (timeDiff < 1000 ) {
                        lastModified = 'A few seconds ago';
                    } else if (timeDiff > 1000 && timeDiff < 10000) {
                        lastModified = 'A few minites agao'
                    } else {
                        lastModified = currentTime.getHours() + ':' + currentTime.getMinutes();
                    }
                    tempAqiInfo.push({
                        city: data.city,
                        aqi: data.aqi,
                        lastUpdated: currentTime,
                        lastModified,
                    });
                } else {
                    tempAqiInfo.push({
                        city: data.city,
                        aqi: data.aqi,
                        lastModified: currentTime.getHours() + ':' + currentTime.getMinutes(),
                    });
                }
            });
          return {
            aqiInfo: tempAqiInfo,
            lastUpdated: currentTime,
          };
        }
    
        return null;
      }

    displayAqiDetails = () => {
        const {
            aqiInfo = [],
        } = this.state;
        return aqiInfo.map((data) => {
            const aqi = +data.aqi || 0;
            let colorCode = '';
            if (aqi >= 0 && aqi <= 50) {
                colorCode = 'good';
            } else if (aqi >= 51 && aqi <= 100) {
                colorCode = 'satisfactory';
            } else if (aqi >= 101 && aqi <= 200) {
                colorCode = 'moderate';
            } else if (aqi >= 201 && aqi <= 300) {
                colorCode = 'poor';
            } else if (aqi >= 301 && aqi <= 400) {
                colorCode = 'verypoor';
            } else if (aqi >= 401 && aqi <= 500) {
                colorCode = 'severe';
            }
            return (
            <tr>
                <td>{data.city}</td>
                <td className={colorCode}>{aqi}</td>
                <td>{data.lastModified}</td>
            </tr>);
        });;
    }

    displayLiveData = () => {
        return (
            <table className="aqiTable">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Current AQI</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>{this.displayAqiDetails()}</tbody>
      </table>)

    }
    render() {
        return (
        <div className="aqiTableWrapper">
            <h1>Air Quality Index Chart</h1>
            {this.displayLiveData()}
        </div>);
    }
}