using PSAService as service from '../../srv/cat-services';

// ============================================================
// 1. ANALYTICS CONFIGURATION
// ============================================================

annotate service.ProjectOverview with @(
    Aggregation.ApplySupported : {
        Transformations : [
            'aggregate',
            'topcount',
            'bottomcount',
            'identity',
            'concat',
            'groupby',
            'filter',
            'expand',
            'search'
        ],
        GroupableProperties : [
            ID,
            projectCode,
            projectName,
            clientID,
            clientName,
            managerID,
            status,
            priority,
            billingType,
            budgetStatus,
            currencyCode,
            startDate,
            endDate
        ],
        AggregatableProperties : [
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : ID,
                SupportedAggregationMethods : ['countdistinct']
            },
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : plannedHours
            },
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : consumedHours
            },
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : budgetAmount
            },
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : consumedAmount
            },
            {
                $Type : 'Aggregation.AggregatablePropertyType',
                Property : remainingAmount
            }
        ]
    },

    // ========================================================
    // 2. AGGREGATED MEASURES
    // ========================================================

    Analytics.AggregatedProperty #projectCount : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : ID,
        AggregationMethod : 'countdistinct',
        Name : 'projectCount',
        ![@Common.Label] : 'Number of Projects'
    },

    Analytics.AggregatedProperty #totalBudget : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : budgetAmount,
        AggregationMethod : 'sum',
        Name : 'totalBudget',
        ![@Common.Label] : 'Total Budget'
    },

    Analytics.AggregatedProperty #totalConsumed : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : consumedAmount,
        AggregationMethod : 'sum',
        Name : 'totalConsumed',
        ![@Common.Label] : 'Total Consumed'
    },

    Analytics.AggregatedProperty #totalRemaining : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : remainingAmount,
        AggregationMethod : 'sum',
        Name : 'totalRemaining',
        ![@Common.Label] : 'Total Remaining'
    },

    Analytics.AggregatedProperty #totalPlannedHours : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : plannedHours,
        AggregationMethod : 'sum',
        Name : 'totalPlannedHours',
        ![@Common.Label] : 'Total Planned Hours'
    },

    Analytics.AggregatedProperty #totalConsumedHours : {
        $Type : 'Analytics.AggregatedPropertyType',
        AggregatableProperty : consumedHours,
        AggregationMethod : 'sum',
        Name : 'totalConsumedHours',
        ![@Common.Label] : 'Total Consumed Hours'
    }
);

// ============================================================
// 3. FILTER BAR
// ============================================================

annotate service.ProjectOverview with @(
    UI.SelectionFields : [
        status,
        priority,
        clientName,
        projectCode,
        budgetStatus
    ]
);

// ============================================================
// 4. CHART: PROJECT COUNT BY STATUS
// ============================================================

annotate service.ProjectOverview with @(
    UI.Chart #ProjectStatusChart : {
        $Type : 'UI.ChartDefinitionType',
        Title : 'Projects by Status',
        ChartType : #Donut,
        Dimensions : [status],
        DynamicMeasures : [
            ![@Analytics.AggregatedProperty#projectCount]
        ],
        DimensionAttributes : [{
            $Type : 'UI.ChartDimensionAttributeType',
            Dimension : status,
            Role : #Category
        }],
        MeasureAttributes : [{
            $Type : 'UI.ChartMeasureAttributeType',
            DynamicMeasure :
                ![@Analytics.AggregatedProperty#projectCount],
            Role : #Axis1
        }]
    }
);

// ============================================================
// 5. CHART: BUDGET BY STATUS
// ============================================================

annotate service.ProjectOverview with @(
    UI.Chart #BudgetByStatusChart : {
        $Type : 'UI.ChartDefinitionType',
        Title : 'Budget by Status',
        ChartType : #Donut,
        Dimensions : [status],
        DynamicMeasures : [
            ![@Analytics.AggregatedProperty#totalBudget]
        ],
        DimensionAttributes : [{
            $Type : 'UI.ChartDimensionAttributeType',
            Dimension : status,
            Role : #Category
        }],
        MeasureAttributes : [{
            $Type : 'UI.ChartMeasureAttributeType',
            DynamicMeasure :
                ![@Analytics.AggregatedProperty#totalBudget],
            Role : #Axis1
        }]
    }
);

// ============================================================
// 6. ANALYTICAL TABLE
// ============================================================

annotate service.ProjectOverview with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : projectCode,
            Label : 'Project Code'
        },
        {
            $Type : 'UI.DataField',
            Value : projectName,
            Label : 'Project Name'
        },
        {
            $Type : 'UI.DataField',
            Value : clientName,
            Label : 'Client'
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status'
        },
        {
            $Type : 'UI.DataField',
            Value : priority,
            Label : 'Priority'
        },
        {
            $Type : 'UI.DataField',
            Value : budgetAmount,
            Label : 'Budget'
        },
        {
            $Type : 'UI.DataField',
            Value : consumedAmount,
            Label : 'Consumed Budget'
        },
        {
            $Type : 'UI.DataField',
            Value : remainingAmount,
            Label : 'Remaining Budget'
        },
        {
            $Type : 'UI.DataField',
            Value : plannedHours,
            Label : 'Planned Hours'
        },
        {
            $Type : 'UI.DataField',
            Value : consumedHours,
            Label : 'Consumed Hours'
        },
        {
            $Type : 'UI.DataField',
            Value : budgetConsumedPercentage,
            Label : 'Budget Utilization %'
        },
        {
            $Type : 'UI.DataField',
            Value : hoursConsumedPercentage,
            Label : 'Hours Utilization %'
        },
        {
            $Type : 'UI.DataField',
            Value : budgetStatus,
            Label : 'Budget Status'
        }
    ]
);

// ============================================================
// 7. PRESENTATION VARIANT
// The first chart is used for the primary chart view.
// ============================================================

annotate service.ProjectOverview with @(
    UI.PresentationVariant #ManagerHome : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.Chart#ProjectStatusChart',
            '@UI.LineItem'
        ]
    }
);

annotate service.ProjectOverview with @(
    UI.SelectionPresentationVariant #ManagerHome : {
        $Type : 'UI.SelectionPresentationVariantType',
        Text : 'Manager Home',
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : []
        },
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.Chart#ProjectStatusChart',
                '@UI.LineItem'
            ]
        }
    }
);

// ============================================================
// 8. OBJECT PAGE HEADER AND IDENTIFICATION
// ============================================================

annotate service.ProjectOverview with @(
    UI.HeaderInfo : {
        TypeName : 'Project',
        TypeNamePlural : 'Projects',
        Title : {
            $Type : 'UI.DataField',
            Value : projectName
        },
        Description : {
            $Type : 'UI.DataField',
            Value : projectCode
        }
    },

    UI.Identification : [
        {
            $Type : 'UI.DataField',
            Value : projectCode,
            Label : 'Project Code'
        },
        {
            $Type : 'UI.DataField',
            Value : projectName,
            Label : 'Project Name'
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status'
        },
        {
            $Type : 'UI.DataField',
            Value : priority,
            Label : 'Priority'
        }
    ]
);

// ============================================================
// 9. PROJECT INFORMATION
// ============================================================

annotate service.ProjectOverview with @(
    UI.FieldGroup #ProjectInformation : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : projectCode,
                Label : 'Project Code'
            },
            {
                $Type : 'UI.DataField',
                Value : projectName,
                Label : 'Project Name'
            },
            {
                $Type : 'UI.DataField',
                Value : description,
                Label : 'Description'
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'Status'
            },
            {
                $Type : 'UI.DataField',
                Value : priority,
                Label : 'Priority'
            },
            {
                $Type : 'UI.DataField',
                Value : billingType,
                Label : 'Billing Type'
            },
            {
                $Type : 'UI.DataField',
                Value : startDate,
                Label : 'Start Date'
            },
            {
                $Type : 'UI.DataField',
                Value : endDate,
                Label : 'End Date'
            }
        ]
    }
);

// ============================================================
// 10. CLIENT AND MANAGER
// ============================================================

annotate service.ProjectOverview with @(
    UI.FieldGroup #ClientManager : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : clientName,
                Label : 'Client'
            },
            {
                $Type : 'UI.DataField',
                Value : clientID,
                Label : 'Client ID'
            },
            {
                $Type : 'UI.DataField',
                Value : managerID,
                Label : 'Manager ID'
            }
        ]
    }
);

// ============================================================
// 11. BUDGET DETAILS
// ============================================================

annotate service.ProjectOverview with @(
    UI.FieldGroup #Budget : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : budgetAmount,
                Label : 'Total Budget'
            },
            {
                $Type : 'UI.DataField',
                Value : consumedAmount,
                Label : 'Consumed Budget'
            },
            {
                $Type : 'UI.DataField',
                Value : remainingAmount,
                Label : 'Remaining Budget'
            },
            {
                $Type : 'UI.DataField',
                Value : billingRateHr,
                Label : 'Billing Rate / Hour'
            },
            {
                $Type : 'UI.DataField',
                Value : currencyCode,
                Label : 'Currency'
            },
            {
                $Type : 'UI.DataField',
                Value : budgetStatus,
                Label : 'Budget Status'
            },
            {
                $Type : 'UI.DataField',
                Value : budgetConsumedPercentage,
                Label : 'Budget Utilization %'
            }
        ]
    }
);

// ============================================================
// 12. HOURS AND UTILIZATION
// ============================================================

annotate service.ProjectOverview with @(
    UI.FieldGroup #Hours : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : plannedHours,
                Label : 'Planned Hours'
            },
            {
                $Type : 'UI.DataField',
                Value : consumedHours,
                Label : 'Consumed Hours'
            },
            {
                $Type : 'UI.DataField',
                Value : hoursConsumedPercentage,
                Label : 'Hours Utilization %'
            }
        ]
    }
);

// ============================================================
// 13. OBJECT PAGE FACETS
// ============================================================

annotate service.ProjectOverview with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'ProjectInformation',
            Label : 'Project Information',
            Target : '@UI.FieldGroup#ProjectInformation'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'ClientManager',
            Label : 'Client & Manager',
            Target : '@UI.FieldGroup#ClientManager'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'Budget',
            Label : 'Budget',
            Target : '@UI.FieldGroup#Budget'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'Hours',
            Label : 'Hours & Utilization',
            Target : '@UI.FieldGroup#Hours'
        }
    ]
);

// ============================================================
// 14. KPI DATA POINTS
// ============================================================

annotate service.ProjectOverview with @(
    UI.DataPoint #TotalProjects : {
        Title : 'Total Projects',
        Value : ID
    },

    UI.DataPoint #TotalBudget : {
        Title : 'Total Budget',
        Value : budgetAmount
    },

    UI.DataPoint #ConsumedBudget : {
        Title : 'Consumed Budget',
        Value : consumedAmount
    },

    UI.DataPoint #RemainingBudget : {
        Title : 'Remaining Budget',
        Value : remainingAmount
    },

    UI.DataPoint #BudgetUtilization : {
        Title : 'Budget Utilization %',
        Value : budgetConsumedPercentage,
        TargetValue : 100
    },

    UI.DataPoint #HoursUtilization : {
        Title : 'Hours Utilization %',
        Value : hoursConsumedPercentage,
        TargetValue : 100
    }
);

// ============================================================
// 15. KPI SELECTION VARIANTS
// ============================================================

annotate service.ProjectOverview with @(
    UI.SelectionVariant #AllProjects : {
        Text : 'All Projects',
        SelectOptions : []
    }
);

// ============================================================
// 16. KPI DEFINITIONS
// ============================================================

// ============================================================
// KPI DATA POINTS
// ============================================================

annotate service.ProjectOverview with @(
    UI.DataPoint #TotalBudget : {
        $Type : 'UI.DataPointType',
        Title : 'Total Budget',
        Value : budgetAmount
    },

    UI.DataPoint #RemainingBudget : {
        $Type : 'UI.DataPointType',
        Title : 'Remaining Budget',
        Value : remainingAmount
    },

    UI.DataPoint #BudgetUtilization : {
        $Type : 'UI.DataPointType',
        Title : 'Budget Utilization',
        Value : budgetConsumedPercentage,
        TargetValue : 100
    },

    UI.DataPoint #HoursUtilization : {
        $Type : 'UI.DataPointType',
        Title : 'Hours Utilization',
        Value : hoursConsumedPercentage,
        TargetValue : 100
    }
);

// ============================================================
// KPI SELECTION VARIANT
// ============================================================

annotate service.ProjectOverview with @(
    UI.SelectionVariant #KPIAllProjects : {
        $Type : 'UI.SelectionVariantType',
        Text : 'All Projects',
        SelectOptions : []
    }
);

// ============================================================
// KPI PRESENTATION VARIANTS
// ============================================================

annotate service.ProjectOverview with @(
    UI.PresentationVariant #PVTotalBudget : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.DataPoint#TotalBudget'
        ]
    },

    UI.PresentationVariant #PVRemainingBudget : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.DataPoint#RemainingBudget'
        ]
    },

    UI.PresentationVariant #PVBudgetUtilization : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.DataPoint#BudgetUtilization'
        ]
    },

    UI.PresentationVariant #PVHoursUtilization : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.DataPoint#HoursUtilization'
        ]
    }
);

// ============================================================
// KPI DEFINITIONS
// ============================================================

annotate service.ProjectOverview with @(
    UI.KPI #KPITotalBudget : {
        $Type : 'UI.KPIType',
        ID : 'KPITotalBudget',
        DataPoint : ![@UI.DataPoint#TotalBudget],
        SelectionVariant : ![@UI.SelectionVariant#KPIAllProjects],
        DefaultPresentationVariant : ![@UI.PresentationVariant#PVTotalBudget]
    },

    UI.KPI #KPIRemainingBudget : {
        $Type : 'UI.KPIType',
        ID : 'KPIRemainingBudget',
        DataPoint : ![@UI.DataPoint#RemainingBudget],
        SelectionVariant : ![@UI.SelectionVariant#KPIAllProjects],
        DefaultPresentationVariant : ![@UI.PresentationVariant#PVRemainingBudget]
    },

    UI.KPI #KPIBudgetUtilization : {
        $Type : 'UI.KPIType',
        ID : 'KPIBudgetUtilization',
        DataPoint : ![@UI.DataPoint#BudgetUtilization],
        SelectionVariant : ![@UI.SelectionVariant#KPIAllProjects],
        DefaultPresentationVariant : ![@UI.PresentationVariant#PVBudgetUtilization]
    },

    UI.KPI #KPIHoursUtilization : {
        $Type : 'UI.KPIType',
        ID : 'KPIHoursUtilization',
        DataPoint : ![@UI.DataPoint#HoursUtilization],
        SelectionVariant : ![@UI.SelectionVariant#KPIAllProjects],
        DefaultPresentationVariant : ![@UI.PresentationVariant#PVHoursUtilization]
    }
);