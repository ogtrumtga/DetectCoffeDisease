import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

const CHART_WIDTH = Dimensions.get('window').width - 140;
const CHART_HEIGHT = 240;
const PADDING = { top: 10, right: 10, bottom: 25, left: 45 };

export function DeltaTHumidityChart() {
  // Chart dimensions
  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  // Scale functions
  const xScale = (temp: number) => PADDING.left + (temp / 50) * chartWidth;
  const yScale = (humidity: number) => PADDING.top + chartHeight - (humidity / 100) * chartHeight;

  // Delta T curve data points (temperature, humidity pairs for each Delta T line)
  const deltaTCurves: Record<2 | 4 | 6 | 8 | 10, number[][]> = {
    2: [
      [0, 65], [5, 70], [10, 76], [15, 80], [20, 83], [25, 86], [30, 88], [35, 89], [40, 90], [45, 90], [50, 90]
    ],
    4: [
      [0, 33], [5, 43], [10, 53], [15, 61], [20, 67], [25, 71], [30, 74], [35, 76], [40, 78], [45, 79], [50, 80]
    ],
    6: [
      [0, 10], [5, 20], [10, 33], [15, 43], [20, 50], [25, 57], [30, 61], [35, 64], [40, 67], [45, 69], [50, 70]
    ],
    8: [
      [0, 10], [5, 10], [10, 12], [15, 28], [20, 38], [25, 45], [30, 50], [35, 55], [40, 58], [45, 60], [50, 62]
    ],
    10: [
      [0, 10], [5, 10], [10, 10], [15, 12], [20, 23], [25, 32], [30, 38], [35, 43], [40, 47], [45, 51], [50, 54]
    ]
  };

  // Generate smooth curve path
  const generatePath = (points: number[][]) => {
    if (points.length === 0) return '';
    
    let path = `M ${xScale(points[0][0])} ${yScale(points[0][1])}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = xScale(points[i][0]);
      const y = yScale(points[i][1]);
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  // Colors for each Delta T line
  const lineColors: Record<2 | 4 | 6 | 8 | 10, string> = {
    2: '#D2A679',
    4: '#5CB85C',
    6: '#2E7D5F',
    8: '#C8A05C',
    10: '#A94E7D'
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartRow}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Background zones */}
          <Path
            d={`
              M ${PADDING.left} ${PADDING.top}
              L ${PADDING.left + chartWidth} ${PADDING.top}
              L ${PADDING.left + chartWidth} ${yScale(90)}
              L ${xScale(50)} ${yScale(90)}
              L ${xScale(45)} ${yScale(90)}
              L ${xScale(40)} ${yScale(90)}
              L ${xScale(35)} ${yScale(89)}
              L ${xScale(30)} ${yScale(88)}
              L ${xScale(25)} ${yScale(86)}
              L ${xScale(20)} ${yScale(83)}
              L ${xScale(15)} ${yScale(80)}
              L ${xScale(10)} ${yScale(76)}
              L ${xScale(5)} ${yScale(70)}
              L ${xScale(0)} ${yScale(65)}
              Z
            `}
            fill="#F5DEB3"
            opacity={0.6}
          />

          {/* Zone between Delta T 2 and 4 */}
          <Path
            d={`
              ${generatePath(deltaTCurves[2])}
              L ${xScale(50)} ${yScale(80)}
              ${deltaTCurves[4].slice().reverse().map((p, i) => 
                `L ${xScale(p[0])} ${yScale(p[1])}`
              ).join(' ')}
              Z
            `}
            fill="#FFE4B5"
            opacity={0.5}
          />

          {/* Zone between Delta T 4 and 6 - good zone */}
          <Path
            d={`
              ${generatePath(deltaTCurves[4])}
              L ${xScale(50)} ${yScale(70)}
              ${deltaTCurves[6].slice().reverse().map((p, i) => 
                `L ${xScale(p[0])} ${yScale(p[1])}`
              ).join(' ')}
              Z
            `}
            fill="#98D8C8"
            opacity={0.7}
          />

          {/* Zone between Delta T 6 and 8 */}
          <Path
            d={`
              ${generatePath(deltaTCurves[6])}
              L ${xScale(50)} ${yScale(62)}
              ${deltaTCurves[8].slice().reverse().map((p, i) => 
                `L ${xScale(p[0])} ${yScale(p[1])}`
              ).join(' ')}
              Z
            `}
            fill="#FFE4B5"
            opacity={0.5}
          />

          {/* Zone between Delta T 8 and 10 */}
          <Path
            d={`
              ${generatePath(deltaTCurves[8])}
              L ${xScale(50)} ${yScale(54)}
              ${deltaTCurves[10].slice().reverse().map((p, i) => 
                `L ${xScale(p[0])} ${yScale(p[1])}`
              ).join(' ')}
              Z
            `}
            fill="#FFD4A3"
            opacity={0.5}
          />

          {/* Zone below Delta T 10 - bad zone */}
          <Path
            d={`
              ${generatePath(deltaTCurves[10])}
              L ${xScale(50)} ${PADDING.top + chartHeight}
              L ${PADDING.left} ${PADDING.top + chartHeight}
              Z
            `}
            fill="#FFB6C1"
            opacity={0.7}
          />

          {/* Grid lines - horizontal */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((humidity) => (
            <Line
              key={`h-${humidity}`}
              x1={PADDING.left}
              y1={yScale(humidity)}
              x2={PADDING.left + chartWidth}
              y2={yScale(humidity)}
              stroke="#999"
              strokeWidth="0.4"
            />
          ))}

          {/* Grid lines - vertical */}
          {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((temp) => (
            <Line
              key={`v-${temp}`}
              x1={xScale(temp)}
              y1={PADDING.top}
              x2={xScale(temp)}
              y2={PADDING.top + chartHeight}
              stroke="#999"
              strokeWidth="0.4"
            />
          ))}

          {/* Border lines */}
          <Line 
            x1={PADDING.left} 
            y1={PADDING.top} 
            x2={PADDING.left + chartWidth} 
            y2={PADDING.top} 
            stroke="#333" 
            strokeWidth="1" 
          />
          <Line 
            x1={PADDING.left} 
            y1={PADDING.top} 
            x2={PADDING.left} 
            y2={PADDING.top + chartHeight} 
            stroke="#333" 
            strokeWidth="1" 
          />
          <Line 
            x1={PADDING.left} 
            y1={PADDING.top + chartHeight} 
            x2={PADDING.left + chartWidth} 
            y2={PADDING.top + chartHeight} 
            stroke="#333" 
            strokeWidth="1" 
          />

          {/* Delta T curves */}
          {([2, 4, 6, 8, 10] as const).map((deltaT) => {
            const points = deltaTCurves[deltaT];
            const color = lineColors[deltaT];
            return (
              <Path 
                key={`line-${deltaT}`}
                d={generatePath(points)} 
                stroke={color} 
                strokeWidth="1.5" 
                fill="none"
              />
            );
          })}

          {/* Data points on curves */}
          {([2, 4, 6, 8, 10] as const).map((deltaT) => {
            const points = deltaTCurves[deltaT];
            const color = lineColors[deltaT];
            
            return points.map((point, i) => {
              const cx = xScale(point[0]);
              const cy = yScale(point[1]);
              
              if (deltaT === 2 || deltaT === 8) {
                return (
                  <Circle
                    key={`${deltaT}-${i}`}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill={color}
                    stroke="none"
                  />
                );
              } else if (deltaT === 4 || deltaT === 6) {
                return (
                  <Path
                    key={`${deltaT}-${i}`}
                    d={`M ${cx - 2} ${cy - 2} L ${cx + 2} ${cy - 2} L ${cx + 2} ${cy + 2} L ${cx - 2} ${cy + 2} Z`}
                    fill={color}
                    stroke="none"
                  />
                );
              } else {
                return (
                  <React.Fragment key={`${deltaT}-${i}`}>
                    <Line
                      x1={cx - 2.5}
                      y1={cy - 2.5}
                      x2={cx + 2.5}
                      y2={cy + 2.5}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <Line
                      x1={cx - 2.5}
                      y1={cy + 2.5}
                      x2={cx + 2.5}
                      y2={cy - 2.5}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                  </React.Fragment>
                );
              }
            });
          })}

          {/* Y-axis labels (Humidity) */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((humidity) => (
            <SvgText
              key={`y-label-${humidity}`}
              x={PADDING.left - 8}
              y={yScale(humidity) + 4}
              fontSize="9"
              fill="#333"
              textAnchor="end"
              fontWeight="700"
            >
              {humidity}
            </SvgText>
          ))}

          {/* X-axis labels (Temperature) */}
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((temp) => (
            <SvgText
              key={`x-label-${temp}`}
              x={xScale(temp)}
              y={PADDING.top + chartHeight + 14}
              fontSize="9"
              fill="#333"
              textAnchor="middle"
              fontWeight="700"
            >
              {temp}
            </SvgText>
          ))}

          {/* Axis titles */}
          <SvgText
            x={PADDING.left + chartWidth / 2}
            y={CHART_HEIGHT - 2}
            fontSize="9"
            fill="#333"
            textAnchor="middle"
            fontWeight="700"
          >
            Temperature (°C)
          </SvgText>
        </Svg>

        {/* Legend on the right */}
        <View style={styles.legendRight}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>Delta T</Text>
            <Text style={styles.legendSubtitle}>(°C)</Text>
          </View>
          
          {[
            { value: 2, color: lineColors[2], shape: 'circle' },
            { value: 4, color: lineColors[4], shape: 'square' },
            { value: 6, color: lineColors[6], shape: 'square' },
            { value: 8, color: lineColors[8], shape: 'circle' },
            { value: 10, color: lineColors[10], shape: 'x' }
          ].map((item) => (
            <View key={item.value} style={styles.legendItemRight}>
              <View style={styles.legendLineContainer}>
                <View style={[styles.legendLine, { backgroundColor: item.color }]} />
                {item.shape === 'circle' && (
                  <View style={[styles.legendShapeCircle, { backgroundColor: item.color }]} />
                )}
                {item.shape === 'square' && (
                  <View style={[styles.legendShapeSquare, { backgroundColor: item.color }]} />
                )}
                {item.shape === 'x' && (
                  <View style={styles.legendShapeX}>
                    <Text style={[styles.legendXText, { color: item.color }]}>✕</Text>
                  </View>
                )}
                <View style={[styles.legendLine, { backgroundColor: item.color }]} />
              </View>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Y-axis label */}
      <View style={styles.yAxisLabelContainer}>
        <Text style={styles.yAxisLabel}>Humidity (%)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: '#fff',
    position: 'relative',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  yAxisLabelContainer: {
    position: 'absolute',
    left: -18,
    top: '42%',
    transform: [{ rotate: '-90deg' }],
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#333',
    fontWeight: '700',
  },
  legendRight: {
    marginLeft: 2,
    paddingVertical: 3,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    minWidth: 45,
  },
  legendHeader: {
    alignItems: 'center',
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  legendTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 0,
  },
  legendSubtitle: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  legendItemRight: {
    alignItems: 'center',
    marginVertical: 1.5,
  },
  legendLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    width: 26,
  },
  legendLine: {
    height: 0.8,
    flex: 1,
  },
  legendShapeCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 0.5,
  },
  legendShapeSquare: {
    width: 6,
    height: 6,
    marginHorizontal: 0.5,
  },
  legendShapeX: {
    width: 6,
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0.5,
  },
  legendXText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  legendValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: '700',
  },
});
