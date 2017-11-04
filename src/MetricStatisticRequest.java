import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.util.Arrays;
import java.util.ArrayList;
import java.io.IOException;
import java.util.Properties;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import org.joda.time.*;
import com.amazonaws.services.cloudwatch.AmazonCloudWatchClient;
import com.amazonaws.services.cloudwatch.model.Datapoint;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsResult;
import com.amazonaws.services.cloudwatch.model.GetMetricStatisticsRequest;
import com.amazonaws.services.cloudwatch.model.Dimension;


public class MetricStatisticRequest {

GetMetricStatisticsRequest request = new GetMetricStatisticsRequest();


public MetricStatisticRequest(String namespace, int period, String metricname, List dlist)  {
     DLCUtil u    = new DLCUtil();
     this.request.setNamespace(namespace);
     this.request.setPeriod(period);
     this.request.setMetricName(metricname);
     this.request.setStatistics( Arrays.asList("Average","Maximum","Minimum"));
     this.request.setDimensions(dlist);
}


public GetMetricStatisticsRequest getRequest()     {  return(this.request); }


}
