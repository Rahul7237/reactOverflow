import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import '../css/DashBoard.css';

const DashBoard = ({ userData }) => {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const spark1 = {
    options: {
      chart: {
        id: 'spark1',
        group: 'sparks',
        type: 'line',
        height: 80,
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        }
      },
      series: [{
        data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21]
      }],
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0
      },
      grid: {
        padding: {
          top: 20,
          bottom: 10,
          left: 110
        }
      },
      colors: ['#fff'],
      tooltip: {
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function(val) {
              return '';
            }
          }
        }
      }
    }
  };

  const spark2 = {
    options: {
      chart: {
        id: 'spark2',
        group: 'sparks',
        type: 'line',
        height: 80,
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        }
      },
      series: [{
        data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
      }],
      stroke: {
        curve: 'smooth'
      },
      grid: {
        padding: {
          top: 20,
          bottom: 10,
          left: 110
        }
      },
      markers: {
        size: 0
      },
      colors: ['#fff'],
      tooltip: {
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function(val) {
              return '';
            }
          }
        }
      }
    }
  };

  const lineOptions = {
    options: {
      chart: {
        height: 328,
        type: 'line',
        zoom: {
          enabled: false
        },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 1,
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [{
          name: "Music",
          data: [1, 15, 26, 20, 33, 27]
        },
        {
          name: "Photos",
          data: [3, 33, 21, 42, 19, 32]
        },
        {
          name: "Files",
          data: [0, 39, 52, 11, 29, 43]
        }
      ],
      title: {
        text: 'Media',
        align: 'left',
        offsetY: 25,
        offsetX: 20
      },
      subtitle: {
        text: 'Statistics',
        offsetY: 55,
        offsetX: 20
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: {
          size: 9
        }
      },
      grid: {
        show: true,
        padding: {
          bottom: 0
        }
      },
      labels: ['01/15/2002', '01/16/2002', '01/17/2002', '01/18/2002', '01/19/2002', '01/20/2002'],
      xaxis: {
        tooltip: {
          enabled: false
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -20
      }
    }
  };

  const optionsCircle4 = {
    options: {
      chart: {
        type: 'radialBar',
        height: 350,
        width: 380,
      },
      plotOptions: {
        radialBar: {
          size: undefined,
          inverseOrder: true,
          hollow: {
            margin: 5,
            size: '48%',
            background: 'transparent',
          },
          track: {
            show: false,
          },
          startAngle: -180,
          endAngle: 180
        },
      },
      stroke: {
        lineCap: 'round'
      },
      series: [71, 63, 77],
      labels: ['June', 'May', 'April'],
      legend: {
        show: true,
        floating: true,
        position: 'right',
        offsetX: 70,
        offsetY: 240
      },
    }
  };

  const optionsBar = {
    options:{
    chart: {
      height: 380,
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        horizontal: false,
      },
    },
    series: [{
      name: 'PRODUCT A',
      data: [14, 25, 21, 17, 12, 13, 11, 19]
    }, {
      name: 'PRODUCT B',
      data: [13, 23, 20, 8, 13, 27, 33, 12]
    }, {
      name: 'PRODUCT C',
      data: [11, 17, 15, 15, 21, 14, 15, 13]
    }],
    xaxis: {
      categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'],
    },
    fill: {
      opacity: 1
    },
  }
};

  const optionsArea = {
    options: {
    chart: {
      height: 380,
      type: 'area',
      stacked: false,
    },
    stroke: {
      curve: 'straight'
    },
    series: [{
        name: "Music",
        data: [11, 15, 26, 20, 33, 27]
      },
      {
        name: "Photos",
        data: [32, 33, 21, 42, 19, 32]
      },
      {
        name: "Files",
        data: [20, 39, 52, 11, 29, 43]
      }
    ],
    xaxis: {
      categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2'],
    },
    tooltip: {
      followCursor: true
    },
    fill: {
      opacity: 1,
    },
  }
};

const renderCharts = () => {
  return (
    <div className="charts">
      <div className="chart1">
        <Chart options={lineOptions.options} series={lineOptions.options.series} type="line" height={328} />
      </div>
      <div className="chart2">
        <Chart options={optionsCircle4.options} series={optionsCircle4.options.series} type="radialBar" height={350} width={380} />
      </div>
    </div>
  );
};

const renderYourStats = () => {
  return (
    <div >
      <h3>Your Stats</h3>
      {renderCharts()}
    </div>
  );
};

const renderRecentActivity = () => {
  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      {/* Add recent activity here */}
    </div>
  );
};

  return (
    <div>
    <div className="dashboard">
    <h1>Welcome, {userData.firstName}!</h1>
    <div className="dashboard-content">
      {/* <button onClick={() => handleSectionClick('yourStats')}>Your Stats</button> */}
      {/* <button onClick={() => handleSectionClick('recentActivity')}>Recent Activity</button> */}
    </div>
    </div>
    {activeSection === 'yourStats' && renderYourStats()}
    {activeSection === 'recentActivity' && renderRecentActivity()}
  </div>
  );
};

export default DashBoard;
