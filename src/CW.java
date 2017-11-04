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


public class CW {

private final DLCUtil dlcutil = new DLCUtil();
private int hours = 4; 
private int period = 60*60; 
private int offsethours = 0; 
private int multi = 1; 
private List<Datapoint> list = new ArrayList<Datapoint>();


public int setHours(int n)  { this.hours = n; setMulti(1); if ( n > 24 ) { setMulti(n / 24); this.hours = 24;} return(this.hours);}
public int getHours()       { return(this.hours); }
public int setOffsetHours(int n) { this.offsethours = n; return(n); }
public int getOffsetHours()      { return(this.offsethours); }
public int setPeriod(int n) { this.period = n; return(n); }
public int getPeriod()      { return(this.period); }
public int setMulti(int n)  { this.multi = n; return(n); }
public int getMulti()       {  return(this.multi); }
public List<Datapoint> getDataPoints()  {  return(this.list); }
public List<Datapoint> getList()  {  return(this.list); }

// addDimension(dimensionList,"LinkedAccount",custom.getAccountNumber(aws_env));
// addDimension(dimensionList,"LinkedAccount",account);

public CW(AmazonCloudWatchClient cloudWatch, String account, String ServiceName)  {
     List<Dimension> dimensionList = new ArrayList<Dimension>();
     List<String> stats = Arrays.asList("Average","Maximum","Minimum");
     if (! ServiceName.equals("")) addDimension(dimensionList,"ServiceName",ServiceName);
     addDimension(dimensionList,"Currency","USD");
     GetMetricStatisticsRequest request = new GetMetricStatisticsRequest();
          request.setNamespace("AWS/Billing");
          request.setPeriod(getPeriod());
          request.setMetricName("EstimatedCharges");
          request.setStatistics(stats);
          request.setDimensions(dimensionList);
     //Joda Time
     for (int i=0;i<getMulti();i++) {
          // END TIME, Typically Now, where getStartOffset() == ZERO
          request.setEndTime( (new DateTime()).minusHours(getOffsetHours()).toDate());
          // START TIME, A Time in the Past
          request.setStartTime( (new DateTime()).minusHours(getOffsetHours()+getHours()).toDate());
          GetMetricStatisticsResult r = cloudWatch.getMetricStatistics(request);
          this.list.addAll(r.getDatapoints());
          dlcutil.sysOut("[setup]",
                     ServiceName + " " + account,
                     (new DateTime()).minusHours(getOffsetHours()).toDate().toString(),
                     (new DateTime()).minusHours(getOffsetHours()+getHours()).toDate().toString(),
                     Integer.toString(getHours()),
                     Integer.toString(getOffsetHours())
          );
     }

     Collections.sort(this.list, new Comparator<Datapoint>() {
      @Override
      public int compare(Datapoint i1, Datapoint i2) {
           return i1.getTimestamp().compareTo(i2.getTimestamp());
      }
     }); 

     for (Datapoint dp: this.list) { dlcutil.sysOut(ServiceName,account,dp.getTimestamp().toString(),dp.getMaximum().toString()); }
}



private static void addDimension(List<Dimension> list, String name, String value) {
     Dimension d = new Dimension();
     d.setName(name);
     d.setValue(value);
     list.add(d);
}

}
