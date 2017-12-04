import java.util.List;
import com.amazonaws.services.ec2.model.Instance;
import com.amazonaws.services.ec2.model.Tag;

public class InstanceQ {
     String   Id;
     String   env;
     String   name;
     String   region;
     String   status;
     String   monitoringState;
     Instance inst;
     public InstanceQ(DLCConnect cn, String id) {
         this.region    = cn.getRegion();
         this.env       = cn.getEnv();
         this.inst      = InstanceX.getInstanceById(cn,this.env,this.region,id);


         this.monitoringState = this.inst.getMonitoring().getState();
         this.Id        = this.inst.getInstanceId();
         List <Tag> t1  = this.inst.getTags();
         for (Tag teg:t1) if (teg.getKey().equals("Name") )   this.name = teg.getValue();
         this.status    = InstanceX.mapInstanceState(this.inst.getState().getName());
    }
    public Instance getInstance()          { return this.inst; }
    public String   getId()                { return this.Id; }
    public String   getMonitoringState()   { return this.monitoringState; }
    public String   getName()              { return this.name; }
    public String   getEnv()               { return this.env; }
    public String   getRegion()            { return this.region; }
    public String   getStatus()            { return this.status; }
    public Boolean  isDetailedMonitoring() {
        return(this.monitoringState.equals("enabled") ? true : false );
    }
}
